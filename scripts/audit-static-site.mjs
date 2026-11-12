import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repositoryRoot, "out");
const origin = "https://learnaboutjainism.com";
const errors = [];

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

function fileForPath(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const relativePath = decodedPath.replace(/^\/+/, "");
  const exactPath = path.join(outputRoot, relativePath);
  if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) return exactPath;
  // Topic IDs contain dots (for example D01.T001), so path.extname cannot
  // distinguish a file suffix from part of a route name here.
  const htmlPath = `${exactPath}.html`;
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) return htmlPath;
  return null;
}

function hasCompleteEditorialReview(topicId) {
  const file = path.join(repositoryRoot, "src", "data", "topics", `${topicId}.json`);
  if (!fs.existsSync(file)) return false;
  try {
    const review = JSON.parse(fs.readFileSync(file, "utf8")).editorial_review;
    const validDate = typeof review?.reviewed_on === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_on) &&
      !Number.isNaN(Date.parse(`${review.reviewed_on}T00:00:00Z`));
    const validSources = Array.isArray(review?.sources) && review.sources.length > 0 && review.sources.every((source) => {
      try {
        return Boolean(
          source.title?.trim() &&
            new URL(source.url ?? "").protocol === "https:" &&
            source.source_type?.trim() &&
            source.locator?.trim(),
        );
      } catch {
        return false;
      }
    });
    return Boolean(
      review?.status === "reviewed" &&
        review.reviewed_by?.trim() &&
        review.reviewer_qualification?.trim() &&
        validDate &&
        validSources,
    );
  } catch {
    return false;
  }
}

if (!fs.existsSync(outputRoot)) {
  console.error("Static site audit failed: run `npm run build` before `npm run site:audit`.");
  process.exit(1);
}

const files = collectFiles(outputRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const staticBytes = files.reduce((total, file) => total + fs.statSync(file).size, 0);
const largestFile = files.reduce(
  (largest, file) => fs.statSync(file).size > largest.bytes
    ? { file, bytes: fs.statSync(file).size }
    : largest,
  { file: "", bytes: 0 },
);

for (const required of [
  "en.html",
  "en/start-here.html",
  "en/ontology.html",
  "en/about-this-library.html",
  "en/aradhana.html",
  "robots.txt",
  "sitemap.xml",
  "_redirects",
  "_headers",
]) {
  if (!fs.existsSync(path.join(outputRoot, required))) errors.push(`Missing required output: ${required}`);
}

if (files.length > 20_000) errors.push(`Pages Free file limit exceeded: ${files.length} files.`);
if (largestFile.bytes > 25 * 1024 * 1024) errors.push(`Pages per-file limit exceeded: ${largestFile.file}`);

const redirects = fs.readFileSync(path.join(outputRoot, "_redirects"), "utf8");
if (!/^\/\s+\/en\s+302\s*$/m.test(redirects)) errors.push("Root locale redirect to /en is missing.");

const headers = fs.readFileSync(path.join(outputRoot, "_headers"), "utf8");
if (!headers.includes("/api/data/*") || !headers.includes("/api/karma") || !headers.includes("Content-Type: application/json")) {
  errors.push("Static API JSON response headers are missing.");
}

const robots = fs.readFileSync(path.join(outputRoot, "robots.txt"), "utf8");
if (!robots.includes(`${origin}/sitemap.xml`)) errors.push("robots.txt does not reference the production sitemap.");

const sitemap = fs.readFileSync(path.join(outputRoot, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length === 0) errors.push("The sitemap contains no URLs.");
for (const url of sitemapUrls) {
  if (!url.startsWith(origin)) errors.push(`Sitemap URL is outside the canonical domain: ${url}`);
  if (!fileForPath(new URL(url).pathname)) errors.push(`Sitemap route is missing from the export: ${url}`);
}

const sitemapUrlSet = new Set(sitemapUrls);
const fixedSitemapPaths = ["/en", "/en/start-here", "/en/ontology", "/en/about-this-library"];
const allowedSitemapUrls = new Set(fixedSitemapPaths.map((pathname) => `${origin}${pathname}`));
for (const pathname of fixedSitemapPaths) {
  if (!sitemapUrlSet.has(`${origin}${pathname}`)) errors.push(`A core public page is missing from the sitemap: ${pathname}`);
  const htmlPath = pathname === "/en"
    ? path.join(outputRoot, "en.html")
    : path.join(outputRoot, `${pathname.slice(1)}.html`);
  const pageHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
  if (!pageHtml.includes(`<link rel="canonical" href="${origin}${pathname}"`)) {
    errors.push(`Incorrect or missing canonical URL for ${pathname}`);
  }
}

const ontology = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "src", "data", "ontology.json"), "utf8"));
let cataloguePagesChecked = 0;
let reviewedTopics = 0;
for (const topic of ontology.domains.flatMap((domain) => domain.topics)) {
  const topicFile = path.join(outputRoot, "en", "ontology", `${topic.topic_id}.html`);
  if (!fs.existsSync(topicFile)) {
    errors.push(`Missing exported topic page: ${topic.topic_id}`);
    continue;
  }
  cataloguePagesChecked += 1;

  const html = fs.readFileSync(topicFile, "utf8");
  const topicUrl = `${origin}/en/ontology/${topic.topic_id}`;
  const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
  const shouldIndex = hasCompleteEditorialReview(topic.topic_id);
  if (shouldIndex) reviewedTopics += 1;

  if (!html.includes(`<link rel="canonical" href="${topicUrl}"`)) {
    errors.push(`Incorrect or missing canonical URL for topic ${topic.topic_id}`);
  }
  if (shouldIndex) {
    allowedSitemapUrls.add(topicUrl);
    if (robotsMatch?.[1].includes("noindex")) errors.push(`Reviewed topic is noindex: ${topic.topic_id}`);
    if (!sitemapUrlSet.has(topicUrl)) errors.push(`Reviewed topic is missing from the sitemap: ${topic.topic_id}`);
  } else {
    if (!robotsMatch?.[1].includes("noindex")) errors.push(`Unreviewed topic is indexable: ${topic.topic_id}`);
    if (sitemapUrlSet.has(topicUrl)) errors.push(`Unreviewed topic appears in the sitemap: ${topic.topic_id}`);
  }
}
for (const url of sitemapUrlSet) {
  if (!allowedSitemapUrls.has(url)) errors.push(`Sitemap includes a page that is not approved for indexing: ${url}`);
}

let internalLinksChecked = 0;
let imagesChecked = 0;
for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const relativeHtmlPath = path.relative(outputRoot, htmlFile).replaceAll(path.sep, "/");
  const routePath = relativeHtmlPath === "en.html"
    ? "/en"
    : `/${relativeHtmlPath.replace(/\.html$/, "")}`;
  const pageUrl = new URL(routePath, origin);
  if (relativeHtmlPath.startsWith("en/aradhana")) {
    const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
    if (!robotsMatch?.[1].includes("noindex")) {
      errors.push(`Practice page is indexable before editorial review: ${relativeHtmlPath}`);
    }
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1].replaceAll("&amp;", "&");
    if (!target || target.startsWith("#") || /^(?:data:|mailto:|tel:|javascript:)/i.test(target)) continue;

    let url;
    try {
      url = new URL(target, pageUrl);
    } catch {
      errors.push(`Invalid link in ${relativeHtmlPath}: ${target}`);
      continue;
    }
    if (url.origin !== origin) continue;
    internalLinksChecked += 1;
    if (!fileForPath(url.pathname)) errors.push(`Broken internal link in ${relativeHtmlPath}: ${url.pathname}`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    imagesChecked += 1;
    if (!/\balt\s*=\s*(["']).*?\1/i.test(match[1])) {
      errors.push(`Image without alt text in ${relativeHtmlPath}`);
    }
  }
}

for (const apiFile of files.filter((file) => path.relative(outputRoot, file).startsWith(`api${path.sep}`))) {
  try {
    JSON.parse(fs.readFileSync(apiFile, "utf8"));
  } catch {
    errors.push(`Invalid static API JSON: ${path.relative(outputRoot, apiFile)}`);
  }
}

console.log("Static site audit");
console.log(`- Files: ${files.length} (${(staticBytes / 1024 / 1024).toFixed(2)} MiB total)`);
console.log(`- Largest file: ${largestFile.bytes.toLocaleString("en-US")} bytes`);
console.log(`- HTML pages: ${htmlFiles.length}`);
console.log(`- Catalogue pages checked: ${cataloguePagesChecked}`);
console.log(`- Topics eligible for indexing: ${reviewedTopics}`);
console.log(`- Sitemap URLs: ${sitemapUrls.length}`);
console.log(`- Internal links checked: ${internalLinksChecked}`);
console.log(`- Images checked: ${imagesChecked}`);
console.log(`- Static API JSON files checked: ${files.filter((file) => path.relative(outputRoot, file).startsWith(`api${path.sep}`)).length}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} issue(s) found:`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`- ${errors.length - 50} additional issue(s) omitted.`);
  process.exit(1);
}

console.log("All structural and launch checks passed.");
