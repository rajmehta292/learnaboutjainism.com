import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicExperience from "@/components/TopicExperience";
import TranslationInProgressContent from "@/components/TranslationInProgressContent";
import ontology from "@/data/ontology.json";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
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
  title?: string;
  primary_sources?: Array<Record<string, string | undefined>>;
  misconceptions?: Array<{ myth: string; reality: string }>;
  editorial_review?: EditorialReview;
};

const topicIndex = new Map<string, TopicRecord>(
  ontology.domains.flatMap((domain) =>
    domain.topics.map((topic) => [topic.topic_id, { ...topic, domain: domain.domain }] as const),
  ),
);
const topicLinks = [...topicIndex.values()].map((topic) => ({ title: topic.title, id: topic.topic_id }));
const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");

export const dynamicParams = false;

export function generateStaticParams({ params }: { params?: { locale?: string } }) {
  if (params?.locale === "hi" || params?.locale === "gu") {
    // Static export requires a non-empty result for every parent locale.
    // This private sentinel exports no real topic article in the draft locales.
    return [{ topic_id: "_untranslated" }];
  }
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

function getReviewStatus(data: TopicData) {
  return isCompleteReview(data.editorial_review) ? data.editorial_review : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; topic_id: string }>;
}): Promise<Metadata> {
  const { locale, topic_id } = await params;
  if (topic_id === "_untranslated" && locale !== "en") {
    const pending = getMessages(locale as SiteLocale).Pending;
    return { title: pending.metadataTitle, description: pending.description, robots: { index: false, follow: false } };
  }
  const topic = topicIndex.get(topic_id);
  if (!topic) {
    return { title: "Topic not found", robots: { index: false, follow: false } };
  }

  const data = getTopicData(topic_id);
  const description = data?.overview?.replace(/[*_`]/g, "").replace(/\s+/g, " ").slice(0, 155);
  const reviewed = isCompleteReview(data?.editorial_review);
  const pageDescription = description || `A guide to ${topic.title} in Jain traditions.`;

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
  params: Promise<{ locale: string; topic_id: string }>;
}) {
  const { locale, topic_id } = await params;
  if (topic_id === "_untranslated" && locale !== "en") {
    return <TranslationInProgressContent copy={getMessages(locale as SiteLocale).Pending} />;
  }
  if (!/^D\d{2}\.T\d{3}$/.test(topic_id)) notFound();

  const topic = topicIndex.get(topic_id);
  if (!topic) notFound();

  const data = getTopicData(topic_id);
  if (!data) {
    return (
      <TopicExperience
        topicId={topic_id}
        title={topic.title}
        domain={topic.domain}
        initialContent={{ title: topic.title, overview: "" }}
        topicLinks={topicLinks}
        initialNeedsReview
        needsReviewLabel={getMessages(locale as SiteLocale).Navigation.needsReview}
      />
    );
  }

  const review = getReviewStatus(data);
  return <TopicExperience
    topicId={topic_id}
    title={topic.title}
    domain={topic.domain}
    initialContent={data}
    topicLinks={topicLinks}
    initialNeedsReview={!review}
    needsReviewLabel={getMessages(locale as SiteLocale).Navigation.needsReview}
  />;
}
