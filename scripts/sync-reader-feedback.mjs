import fs from "node:fs";
import path from "node:path";

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required.");

const payload = JSON.parse(fs.readFileSync(eventPath, "utf8"));
const issue = payload.issue;
if (!issue || !Number.isSafeInteger(issue.number)) {
  throw new Error("The GitHub event does not contain a valid issue.");
}

const titlePrefix = "Reader feedback:";
if (!issue.title?.startsWith(titlePrefix)) {
  console.log(`Issue #${issue.number} is not a reader-feedback submission; skipping.`);
  process.exit(0);
}

const knownHeadings = new Map([
  ["Type of feedback", "feedbackType"],
  ["Page URL", "pageUrl"],
  ["What should we review?", "feedback"],
  ["Supporting source or context", "supportingContext"],
]);
const fields = new Map();
let currentField = null;
let currentLines = [];

function saveCurrentField() {
  if (!currentField) return;
  const value = currentLines.join("\n").trim();
  fields.set(currentField, /^_?No response_?$/i.test(value) ? "" : value);
}

for (const line of String(issue.body ?? "").split(/\r?\n/)) {
  const heading = line.match(/^###\s+(.+?)\s*$/)?.[1];
  const fieldName = heading ? knownHeadings.get(heading) : null;
  if (fieldName) {
    saveCurrentField();
    currentField = fieldName;
    currentLines = [];
  } else if (currentField) {
    currentLines.push(line);
  }
}
saveCurrentField();

const feedback = fields.get("feedback") ?? "";
if (!feedback) throw new Error(`Reader feedback issue #${issue.number} has no feedback text.`);

const allowedTypes = new Set([
  "Correction or source issue",
  "Accessibility barrier",
  "Other suggestion",
]);
const rawType = fields.get("feedbackType") ?? "";
const feedbackType = allowedTypes.has(rawType) ? rawType : "Not specified";

function flatten(value, maxLength) {
  return String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

function csvCell(value) {
  let safeValue = flatten(value, 5000);
  if (/^[=+\-@\t\r]/.test(safeValue)) safeValue = `'${safeValue}`;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

const header = "issue_number,created_at,updated_at,feedback_type,page_url,feedback,supporting_context,issue_url,state";
const row = [
  String(issue.number),
  issue.created_at,
  issue.updated_at,
  feedbackType,
  flatten(fields.get("pageUrl"), 1000),
  feedback,
  fields.get("supportingContext") ?? "",
  issue.html_url,
  issue.state,
].map((value, index) => index === 0 ? value : csvCell(value)).join(",");

const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
const csvPath = path.join(workspace, "docs", "reader-feedback.csv");
const existing = fs.existsSync(csvPath) ? fs.readFileSync(csvPath, "utf8") : `${header}\n`;
const lines = existing.split(/\r?\n/).filter(Boolean);
if (lines[0] !== header) throw new Error("docs/reader-feedback.csv has an unexpected header.");

const issueRowPrefix = `${issue.number},`;
const nextLines = [header, ...lines.slice(1).filter((line) => !line.startsWith(issueRowPrefix)), row];
fs.writeFileSync(csvPath, `${nextLines.join("\n")}\n`, "utf8");
console.log(`Updated feedback record for issue #${issue.number} in docs/reader-feedback.csv.`);
