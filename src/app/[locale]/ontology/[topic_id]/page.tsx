import type { ReactNode } from "react";
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import EditorialNotice from "@/components/EditorialNotice";
import SmartLinker from "@/components/SmartLinker";
import ontology from "@/data/ontology.json";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

type TopicRecord = {
  topic_id: string;
  title: string;
  domain: string;
};

type ReviewedSource = {
  title: string;
  url: string;
  source_type: string;
  edition?: string;
  translator?: string;
  locator: string;
  tradition?: string;
};

type EditorialReview = {
  status?: string;
  reviewed_by?: string;
  reviewer_qualification?: string;
  reviewed_on?: string;
  sources?: ReviewedSource[];
};

type TopicData = {
  overview?: string;
  misconceptions?: Array<{ myth: string; reality: string }>;
  editorial_review?: EditorialReview;
};

const topicIndex = new Map<string, TopicRecord>(
  ontology.domains.flatMap((domain) =>
    domain.topics.map((topic) => [topic.topic_id, { ...topic, domain: domain.domain }] as const),
  ),
);
const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");

export const dynamicParams = false;

export function generateStaticParams() {
  return ontology.domains.flatMap((domain) =>
    domain.topics.map((topic) => ({ topic_id: topic.topic_id })),
  );
}

function getTopicData(topicId: string): TopicData | null {
  const filePath = path.join(topicsDirectory, `${topicId}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as TopicData;
  } catch {
    return null;
  }
}

function isHttpsUrl(value?: string) {
  try {
    return new URL(value ?? "").protocol === "https:";
  } catch {
    return false;
  }
}

function isCompleteReview(review?: EditorialReview): review is EditorialReview & {
  reviewed_by: string;
  reviewer_qualification: string;
  reviewed_on: string;
  sources: ReviewedSource[];
} {
  return Boolean(
    review?.status === "reviewed" &&
      review.reviewed_by?.trim() &&
      review.reviewer_qualification?.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_on ?? "") &&
      Array.isArray(review.sources) &&
      review.sources.length > 0 &&
      review.sources.every((source) =>
        Boolean(
          source.title?.trim() &&
            isHttpsUrl(source.url) &&
            source.source_type?.trim() &&
            source.locator?.trim(),
        ),
      ),
  );
}

function renderInline(text: string, topicId: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}><SmartLinker text={part.slice(2, -2)} currentTopicId={topicId} /></strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}><SmartLinker text={part.slice(1, -1)} currentTopicId={topicId} /></em>;
    }
    return <SmartLinker key={index} text={part} currentTopicId={topicId} />;
  });
}

function getReviewStatus(data: TopicData) {
  return isCompleteReview(data.editorial_review) ? data.editorial_review : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic_id: string }>;
}): Promise<Metadata> {
  const { topic_id } = await params;
  const topic = topicIndex.get(topic_id);
  if (!topic) {
    return { title: "Topic not found", robots: { index: false, follow: false } };
  }

  const data = getTopicData(topic_id);
  const description = data?.overview?.replace(/[*_`]/g, "").replace(/\s+/g, " ").slice(0, 155);
  const reviewed = isCompleteReview(data?.editorial_review);
  const pageDescription = description || `A catalogue entry about ${topic.title}. Editorial review is ongoing.`;

  return {
    title: topic.title,
    description: pageDescription,
    alternates: { canonical: `/en/ontology/${topic_id}` },
    robots: { index: reviewed, follow: true },
    openGraph: {
      title: `${topic.title} · Learn About Jainism`,
      description: pageDescription,
      url: `/en/ontology/${topic_id}`,
      siteName: "Learn About Jainism",
      type: "article",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} · Learn About Jainism`,
      description: pageDescription,
      images: twitterImages,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic_id: string }>;
}) {
  const { topic_id } = await params;
  if (!/^D\d{2}\.T\d{3}$/.test(topic_id)) notFound();

  const topic = topicIndex.get(topic_id);
  if (!topic) notFound();

  const data = getTopicData(topic_id);
  if (!data) {
    return (
      <main id="main-content">
        <section className="entry-pending">
          <p className="eyebrow">Catalogue entry · In progress</p>
          <h1>{topic.title}</h1>
          <p>
            This subject is listed in the library catalogue, but a readable entry is not available
            yet. The catalogue count includes topics still awaiting a draft.
          </p>
          <Link className="button button--primary" href="/ontology">Return to the library</Link>
        </section>
      </main>
    );
  }

  const review = getReviewStatus(data);
  const paragraphs = (data.overview ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main id="main-content">
      <header className="article-hero">
        <div className="site-container article-hero__inner">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/ontology">Topic library</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{topic.title}</span>
          </nav>
          <p className="eyebrow">{review ? "Reviewed entry" : "Draft topic entry"}</p>
          <h1>{topic.title}</h1>
          <p className="article-hero__domain">{topic.domain}</p>
        </div>
      </header>

      <article className="article-body">
        {review ? (
          <p className="review-byline">
            Reviewed {review.reviewed_on} by {review.reviewed_by}
            {review.reviewer_qualification ? ` · ${review.reviewer_qualification}` : ""}
          </p>
        ) : (
          <EditorialNotice />
        )}

        {paragraphs.length > 0 ? (
          <div className="prose-reading">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{renderInline(paragraph, topic_id)}</p>
            ))}
          </div>
        ) : (
          <p className="empty-state">A readable summary for this topic is still being prepared.</p>
        )}

        {review?.sources && (
          <section className="verified-references" aria-labelledby="verified-references-title">
            <h2 id="verified-references-title">Sources and editions</h2>
            <ul>
              {review.sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                  <p>{[source.source_type, source.tradition, source.edition, source.translator, source.locator].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {review && data.misconceptions && data.misconceptions.length > 0 && (
          <section className="reviewed-misconceptions" aria-labelledby="reviewed-misconceptions-title">
            <h2 id="reviewed-misconceptions-title">Common misunderstandings</h2>
            <ul>
              {data.misconceptions.map((item, index) => (
                <li key={index}>
                  <strong>{item.myth}</strong>
                  <p>{item.reality}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="article-footer" aria-label="Article navigation">
          <Link className="text-link" href="/ontology">← Back to the library</Link>
          <Link className="text-link" href="/about-this-library">How entries are reviewed →</Link>
        </nav>
      </article>
    </main>
  );
}
