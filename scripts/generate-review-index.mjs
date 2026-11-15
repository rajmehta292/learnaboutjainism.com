import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ontology = JSON.parse(fs.readFileSync(path.join(root, "src/data/ontology.json"), "utf8"));
const topicsDirectory = path.join(root, "src/data/topics");
const queuePath = path.join(root, "docs/content-review-queue.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(value);
      value = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const [header, ...data] = rows;
  return data.map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""])));
}

function isCompleteReview(review) {
  if (review?.status !== "reviewed" || !review.reviewed_by?.trim() || !review.reviewer_qualification?.trim()) return false;
  const date = review.reviewed_on;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
  return Array.isArray(review.sources) && review.sources.length > 0 && review.sources.every((source) => {
    try {
      return Boolean(source.title?.trim() && new URL(source.url ?? "").protocol === "https:" && source.source_type?.trim() && source.locator?.trim());
    } catch {
      return false;
    }
  });
}

const queueRows = parseCsv(fs.readFileSync(queuePath, "utf8"));
const queueById = new Map(queueRows.map((row) => [row.topic_id, row]));
const topics = ontology.domains.flatMap((domain) => domain.topics.map((topic) => {
  const file = path.join(topicsDirectory, `${topic.topic_id}.json`);
  let content = null;
  try { content = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  const queue = queueById.get(topic.topic_id);
  const sources = Array.isArray(content?.editorial_review?.sources) && content.editorial_review.sources.length
    ? content.editorial_review.sources
    : Array.isArray(content?.primary_sources) ? content.primary_sources : [];
  return {
    topicId: topic.topic_id,
    title: topic.title,
    domain: domain.domain,
    hasPage: Boolean(content),
    initialStatus: isCompleteReview(content?.editorial_review) ? "verified" : "needs_review",
    sourceCount: sources.length,
    overviewWords: Number(queue?.overview_words ?? 0),
  };
}));

const output = path.join(root, "public/content-review-index.json");
fs.writeFileSync(output, `${JSON.stringify({ topics }, null, 2)}\n`, "utf8");
const topicDataOutput = path.join(root, "public/topic-data");
fs.mkdirSync(topicDataOutput, { recursive: true });
for (const topic of topics) {
  const source = path.join(topicsDirectory, `${topic.topicId}.json`);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(topicDataOutput, `${topic.topicId}.json`));
}
console.log(`Generated ${topics.length} content records at public/content-review-index.json.`);
