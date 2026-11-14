import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Link } from "@/i18n/routing";
import ontology from "@/data/ontology.json";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Editorial;
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: { canonical: "/en/about-this-library" },
    openGraph: { title: `${copy.metadataTitle} · Learn About Jainism`, description: copy.metadataDescription, url: `/${locale}/about-this-library`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.metadataDescription, images: twitterImages },
  };
}

const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");
const indexedTopics = ontology.domains.flatMap((domain) => domain.topics);
const draftedCount = indexedTopics.filter((topic) => fs.existsSync(path.join(topicsDirectory, `${topic.topic_id}.json`))).length;
const reviewedCount = indexedTopics.reduce((count, topic) => {
  const filePath = path.join(topicsDirectory, `${topic.topic_id}.json`);
  if (!fs.existsSync(filePath)) return count;

  try {
    const review = JSON.parse(fs.readFileSync(filePath, "utf8")).editorial_review;
    const reviewDate = typeof review?.reviewed_on === "string" ? new Date(`${review.reviewed_on}T00:00:00Z`) : null;
    const validDate = Boolean(reviewDate && Number.isFinite(reviewDate.getTime()) && reviewDate.toISOString().slice(0, 10) === review.reviewed_on);
    const validSources = Array.isArray(review?.sources) && review.sources.length > 0 && review.sources.every((source: {
      title?: string; url?: string; source_type?: string; locator?: string;
    }) => {
      try {
        return Boolean(source.title?.trim() && new URL(source.url ?? "").protocol === "https:" && source.source_type?.trim() && source.locator?.trim());
      } catch { return false; }
    });

    return count + Number(review?.status === "reviewed" && typeof review.reviewed_by === "string" && review.reviewed_by.trim() &&
      typeof review.reviewer_qualification === "string" && review.reviewer_qualification.trim() && validDate && validSources);
  } catch { return count; }
}, 0);

export default async function AboutThisLibraryPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  const copy = getMessages(locale).Editorial;
  const numberLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-US";
  const coverage = [
    { value: ontology.domain_count, label: copy.subjectAreas },
    { value: indexedTopics.length, label: copy.catalogueTopics },
    { value: draftedCount, label: copy.draftEntries },
    { value: reviewedCount, label: copy.reviewedRecords },
  ];
  const reviewedPoints = copy.reviewedPoints;
  const sourceDescriptions = copy.sourceDescriptions;

  return (
    <main id="main-content">
      <section className="page-intro page-intro--dark">
        <div className="site-container page-intro__inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </div>
      </section>

      <div className="site-container editorial-page">
        <section className="coverage-panel" aria-label={copy.coverageLabel}>
          {coverage.map((item) => (
            <div key={item.label}>
              <span className="coverage-panel__value">{item.value.toLocaleString(numberLocale)}</span>
              <span className="coverage-panel__label">{item.label}</span>
            </div>
          ))}
        </section>

        <section className="editorial-copy">
          <h2>{copy.draftHeading}</h2>
          <p>{copy.draftCopy}</p>

          <h2>{copy.reviewedHeading}</h2>
          <ul>{reviewedPoints.map((point) => <li key={point}>{point}</li>)}</ul>

          <h2>{copy.sourcesHeading}</h2>
          <ul className="reference-list">
            <li>
              <a href="https://www.britannica.com/topic/Jainism" target="_blank" rel="noreferrer">“Jainism,” Encyclopaedia Britannica</a>
              <span>{sourceDescriptions[0]}</span>
            </li>
            <li>
              <a href="https://jainpedia.org/article/themes/principles/sacred-writings/svetambara-canon/" target="_blank" rel="noreferrer">“Śvetāmbara canon,” Jainpedia</a>
              <span>{sourceDescriptions[1]}</span>
            </li>
            <li>
              <a href="https://jainastudies.soas.ac.uk/ijjs/ijjs-0305-2007.pdf" target="_blank" rel="noreferrer">Fujinaga Sin, “Śvetāmbara Canons in the Digambara Tradition,” International Journal of Jaina Studies 3.5 (2007)</a>
              <span>{sourceDescriptions[2]}</span>
            </li>
          </ul>

          <p className="editorial-callout">{copy.reviewCallout}</p>
          <div className="editorial-actions">
            <Link className="button button--primary" href="/start-here">{copy.choosePath}</Link>
            <Link className="text-link" href="/ontology">{copy.openCatalogue} <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
