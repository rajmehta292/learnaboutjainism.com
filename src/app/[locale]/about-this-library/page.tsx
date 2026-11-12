import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Link } from "@/i18n/routing";
import ontology from "@/data/ontology.json";

export const metadata: Metadata = {
  title: "How to read this library",
  description: "Editorial status, source standards, and the limits of this Jain learning project.",
};

const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");
const indexedTopics = ontology.domains.flatMap((domain) => domain.topics);
const draftedCount = indexedTopics.filter((topic) =>
  fs.existsSync(path.join(topicsDirectory, `${topic.topic_id}.json`)),
).length;
const reviewedCount = indexedTopics.reduce((count, topic) => {
  const filePath = path.join(topicsDirectory, `${topic.topic_id}.json`);
  if (!fs.existsSync(filePath)) return count;

  try {
    const review = JSON.parse(fs.readFileSync(filePath, "utf8")).editorial_review;
    const reviewDate = typeof review?.reviewed_on === "string"
      ? new Date(`${review.reviewed_on}T00:00:00Z`)
      : null;
    const validDate = Boolean(
      reviewDate &&
        Number.isFinite(reviewDate.getTime()) &&
        reviewDate.toISOString().slice(0, 10) === review.reviewed_on,
    );
    const validSources = Array.isArray(review?.sources) && review.sources.length > 0 && review.sources.every((source: {
      title?: string;
      url?: string;
      source_type?: string;
      locator?: string;
    }) => {
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

    return count + Number(
      review?.status === "reviewed" &&
        typeof review.reviewed_by === "string" &&
        review.reviewed_by?.trim() &&
        typeof review.reviewer_qualification === "string" &&
        review.reviewer_qualification.trim() &&
        validDate &&
        validSources,
    );
  } catch {
    return count;
  }
}, 0);

export default function AboutThisLibraryPage() {
  return (
    <main id="main-content">
      <section className="page-intro page-intro--dark">
        <div className="site-container page-intro__inner">
          <p className="eyebrow">Editorial method</p>
          <h1>Read with curiosity.<br />Check the source.</h1>
          <p className="page-intro__lead">
            This is a learning project, not a religious authority. Its catalogue is broad; its
            entries are still being reviewed against specific texts, traditions, and scholarship.
          </p>
        </div>
      </section>

      <div className="site-container editorial-page">
        <section className="coverage-panel" aria-label="Current editorial coverage">
          <div>
            <span className="coverage-panel__value">{ontology.domain_count}</span>
            <span className="coverage-panel__label">subject areas</span>
          </div>
          <div>
            <span className="coverage-panel__value">{indexedTopics.length.toLocaleString("en-US")}</span>
            <span className="coverage-panel__label">catalogue topics</span>
          </div>
          <div>
            <span className="coverage-panel__value">{draftedCount.toLocaleString("en-US")}</span>
            <span className="coverage-panel__label">draft entries</span>
          </div>
          <div>
            <span className="coverage-panel__value">{reviewedCount.toLocaleString("en-US")}</span>
            <span className="coverage-panel__label">verified review records</span>
          </div>
        </section>

        <section className="editorial-copy">
          <h2>What “draft” means here</h2>
          <p>
            Existing topic files have not yet been checked claim by claim by an identified human
            reviewer. Their source lists do not include a linked edition and pinpoint location, so
            this site does not display their purported scripture quotations as verified citations.
            Treat summaries as orientation only and follow the linked references below for further
            reading.
          </p>

          <h2>What a reviewed entry will show</h2>
          <ul>
            <li>The source title, edition or translation, and an exact chapter, verse, page, or section.</li>
            <li>Whether a statement comes from a Jain text, a traditional commentary, community teaching, or academic scholarship.</li>
            <li>Tradition-specific interpretations and disagreements, rather than a single account presented as universal.</li>
            <li>A named review record and date; a citation alone does not count as verification.</li>
          </ul>

          <h2>Sources to begin with</h2>
          <ul className="reference-list">
            <li>
              <a href="https://www.britannica.com/topic/Jainism" target="_blank" rel="noreferrer">
                “Jainism,” Encyclopaedia Britannica
              </a>
              <span>A concise secondary overview for initial orientation.</span>
            </li>
            <li>
              <a href="https://jainpedia.org/article/themes/principles/sacred-writings/svetambara-canon/" target="_blank" rel="noreferrer">
                “Śvetāmbara canon,” Jainpedia
              </a>
              <span>A tradition-focused account of textual transmission and differing canons.</span>
            </li>
            <li>
              <a href="https://jainastudies.soas.ac.uk/ijjs/ijjs-0305-2007.pdf" target="_blank" rel="noreferrer">
                Fujinaga Sin, “Śvetāmbara Canons in the Digambara Tradition,” International Journal of Jaina Studies 3.5 (2007)
              </a>
              <span>A specific scholarly argument about historical evidence; read it as one study, not as a universal consensus.</span>
            </li>
          </ul>

          <p className="editorial-callout">
            The first review passes should prioritize the introductory topics, ethics, textual
            traditions, and material that discusses fasting or end-of-life vows. Those subjects
            need qualified human review before the site offers detailed guidance.
          </p>
          <div className="editorial-actions">
            <Link className="button button--primary" href="/start-here">Choose a reading path</Link>
            <Link className="text-link" href="/ontology">Open the topic catalogue <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
