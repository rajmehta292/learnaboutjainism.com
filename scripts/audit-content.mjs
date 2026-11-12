import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ontologyPath = path.join(root, "src", "data", "ontology.json");
const topicsDirectory = path.join(root, "src", "data", "topics");
const args = process.argv.slice(2);
const csvFlagIndex = args.findIndex((arg) => arg === "--csv");
const csvPath = csvFlagIndex >= 0 ? args[csvFlagIndex + 1] : null;
const datasetsCsvFlagIndex = args.findIndex((arg) => arg === "--datasets-csv");
const datasetsCsvPath = datasetsCsvFlagIndex >= 0 ? args[datasetsCsvFlagIndex + 1] : null;

const safetyPatterns = [
  ["fasting", /\bfast(?:s|ed|ing)?\b/i],
  ["sallekhana/santhara", /sallekhan[āa]|santhar[āa]/i],
  ["health or medicine", /medical|medication|pregnan|diabet|eating disorder|illness|health risk/i],
  ["children or youth", /\b(child|children|minor|youth|age[s]?\s+\d{1,2})\b/i],
  ["coercion or harm", /coercion|abuse|forced practice|family violence/i],
  ["end of life", /end[- ]of[- ]life|suicid|self[- ]harm/i],
  ["health, protection, or efficacy claims", /heal(?:s|ed|ing)?|cur(?:e|es|ed)|protect(?:s|ed|ion)?|spiritual efficacy|physical health/i],
  ["universal or superlative claims", /\b(universal|all Jains|all traditions|every Jain|most sacred|most famous|most important|definitive)\b/i],
];

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function hasValidReview(review) {
  const date = typeof review?.reviewed_on === "string" ? new Date(`${review.reviewed_on}T00:00:00Z`) : null;
  const validDate = Boolean(
    date &&
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === review.reviewed_on,
  );

  return Boolean(
    review?.status === "reviewed" &&
      typeof review.reviewed_by === "string" &&
      review.reviewed_by.trim() &&
      typeof review.reviewer_qualification === "string" &&
      review.reviewer_qualification.trim() &&
      validDate &&
      Array.isArray(review.sources) &&
      review.sources.length > 0 &&
      review.sources.every((source) => {
        let url;
        try {
          url = new URL(source.url);
        } catch {
          return false;
        }

        return Boolean(
          typeof source.title === "string" && source.title.trim() &&
            url.protocol === "https:" &&
            typeof source.source_type === "string" && source.source_type.trim() &&
            typeof source.locator === "string" && source.locator.trim(),
        );
      }),
  );
}

function collectStrings(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
  return output;
}

const errors = [];
let ontology;
try {
  ontology = JSON.parse(fs.readFileSync(ontologyPath, "utf8"));
} catch (error) {
  console.error(`Cannot read ${path.relative(root, ontologyPath)}: ${error.message}`);
  process.exit(1);
}

const topics = ontology.domains.flatMap((domain) =>
  domain.topics.map((topic) => ({ ...topic, domainId: domain.domain_id, domain: domain.domain })),
);
const topicIds = new Set();
for (const topic of topics) {
  if (!/^D\d{2}\.T\d{3}$/.test(topic.topic_id)) {
    errors.push(`Invalid topic id: ${topic.topic_id}`);
  }
  if (topicIds.has(topic.topic_id)) errors.push(`Duplicate topic id: ${topic.topic_id}`);
  topicIds.add(topic.topic_id);
}

const rows = [];
let drafted = 0;
let missing = 0;
let reviewed = 0;
let legacySourceRecords = 0;
let completeLegacyCitations = 0;
const safetyTopicIds = new Set();

for (const topic of topics) {
  const filePath = path.join(topicsDirectory, `${topic.topic_id}.json`);
  if (!fs.existsSync(filePath)) {
    missing += 1;
    rows.push({
      ...topic,
      entryStatus: "missing",
      overviewWords: 0,
      legacySourceCount: 0,
      completeLegacyCitationCount: 0,
      reviewStatus: "not started",
      safetyFlags: [],
    });
    continue;
  }

  drafted += 1;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${topic.topic_id}: invalid JSON (${error.message})`);
    continue;
  }

  if (typeof data.overview !== "string" || !data.overview.trim()) {
    errors.push(`${topic.topic_id}: missing overview text`);
  }

  const sources = Array.isArray(data.primary_sources) ? data.primary_sources : [];
  legacySourceRecords += sources.length;
  const completeSources = sources.filter((source) =>
    typeof source.url === "string" &&
    source.url.startsWith("https://") &&
    typeof (source.edition ?? source.translator) === "string" &&
    Boolean(source.locator ?? source.page ?? source.chapter ?? source.verse),
  );
  completeLegacyCitations += completeSources.length;

  const reviewIsValid = hasValidReview(data.editorial_review);
  if (reviewIsValid) reviewed += 1;

  const safetyText = [
    data.overview,
    ...((Array.isArray(data.misconceptions) ? data.misconceptions : []).flatMap((item) => [item.myth, item.reality])),
  ].join("\n");
  const safetyFlags = safetyPatterns
    .filter(([, pattern]) => pattern.test(safetyText))
    .map(([label]) => label);
  if (safetyFlags.length > 0) safetyTopicIds.add(topic.topic_id);

  rows.push({
    ...topic,
    entryStatus: "draft",
    overviewWords: data.overview.split(/\s+/).filter(Boolean).length,
    legacySourceCount: sources.length,
    completeLegacyCitationCount: completeSources.length,
    reviewStatus: reviewIsValid ? "reviewed" : "unreviewed",
    safetyFlags,
  });
}

const onDiskIds = new Set(
  fs.readdirSync(topicsDirectory)
    .filter((file) => /^D\d{2}\.T\d{3}\.json$/.test(file))
    .map((file) => file.slice(0, -5)),
);
for (const fileId of onDiskIds) {
  if (!topicIds.has(fileId)) errors.push(`Topic file is not in ontology: ${fileId}`);
}

console.log("Content audit");
console.log(`- Subject areas: ${ontology.domains.length}`);
console.log(`- Catalogue topics: ${topics.length}`);
console.log(`- Draft entry files: ${drafted}`);
console.log(`- Topics without an entry file: ${missing}`);
console.log(`- Entries with a complete editorial review record: ${reviewed}`);
console.log(`- Legacy source records: ${legacySourceRecords}`);
console.log(`- Legacy citations with URL, edition, and locator: ${completeLegacyCitations}`);
console.log(`- Potentially safety-sensitive topics for human review: ${safetyTopicIds.size}`);

const dataDirectory = path.dirname(ontologyPath);
const supplementalDatasets = fs.readdirSync(dataDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "ontology.json" && entry.name !== "learningPaths.json");
const datasetRows = [];
for (const entry of supplementalDatasets) {
  const filePath = path.join(dataDirectory, entry.name);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const text = collectStrings(data).join("\n");
    const safetyFlags = safetyPatterns
      .filter(([, pattern]) => pattern.test(text))
      .map(([label]) => label);
    const topLevelRecords = Array.isArray(data) ? data.length : (data && typeof data === "object" ? Object.keys(data).length : 1);
    datasetRows.push({ file: entry.name, topLevelRecords, safetyFlags });
  } catch (error) {
    errors.push(`${entry.name}: invalid supplemental dataset JSON (${error.message})`);
  }
}
const flaggedDatasets = datasetRows.filter((row) => row.safetyFlags.length > 0);
console.log(`- Supplemental JSON datasets inventoried: ${datasetRows.length}`);
console.log(`- Supplemental datasets with potential editorial risk terms: ${flaggedDatasets.length}`);
for (const row of flaggedDatasets) {
  console.log(`  - ${row.file}: ${row.safetyFlags.join(", ")}`);
}

console.log("\nCoverage by subject area:");
for (const domain of ontology.domains) {
  const domainRows = rows.filter((row) => row.domainId === domain.domain_id);
  const domainDrafts = domainRows.filter((row) => row.entryStatus === "draft").length;
  const domainReviewed = domainRows.filter((row) => row.reviewStatus === "reviewed").length;
  console.log(`- ${domain.domain}: ${domainDrafts}/${domainRows.length} drafted, ${domainReviewed} reviewed`);
}

if (csvFlagIndex >= 0 && !csvPath) {
  errors.push("--csv requires a file path");
}
if (csvPath) {
  const outputPath = path.resolve(root, csvPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const headers = ["topic_id", "domain", "title", "entry_status", "overview_words", "legacy_sources", "complete_legacy_citations", "review_status", "safety_flags"];
  const output = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => [
      row.topic_id,
      row.domain,
      row.title,
      row.entryStatus,
      row.overviewWords,
      row.legacySourceCount,
      row.completeLegacyCitationCount,
      row.reviewStatus,
      row.safetyFlags.join("; "),
    ].map(csvCell).join(",")),
  ].join("\n");
  fs.writeFileSync(outputPath, `${output}\n`);
  console.log(`\nWrote review queue: ${path.relative(root, outputPath)}`);
}

if (datasetsCsvFlagIndex >= 0 && !datasetsCsvPath) {
  errors.push("--datasets-csv requires a file path");
}
if (datasetsCsvPath) {
  const outputPath = path.resolve(root, datasetsCsvPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const headers = ["dataset_file", "top_level_records", "potential_review_flags"];
  const output = [
    headers.map(csvCell).join(","),
    ...datasetRows.map((row) => [row.file, row.topLevelRecords, row.safetyFlags.join("; ")].map(csvCell).join(",")),
  ].join("\n");
  fs.writeFileSync(outputPath, `${output}\n`);
  console.log(`Wrote supplemental dataset queue: ${path.relative(root, outputPath)}`);
}

if (errors.length > 0) {
  console.error(`\nStructural errors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nStructural checks passed. Review and safety counts are editorial work queues, not automated fact checks.");
}
