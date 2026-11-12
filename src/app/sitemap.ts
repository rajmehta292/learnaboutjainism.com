import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import ontology from "@/data/ontology.json";

export const dynamic = "force-static";

type ReviewSource = {
  title?: string;
  url?: string;
  source_type?: string;
  locator?: string;
};

type TopicReview = {
  status?: string;
  reviewed_by?: string;
  reviewer_qualification?: string;
  reviewed_on?: string;
  sources?: ReviewSource[];
};

type TopicContent = { editorial_review?: TopicReview };

function hasCompleteReview(topicId: string): boolean {
  const file = path.join(process.cwd(), "src", "data", "topics", `${topicId}.json`);
  if (!fs.existsSync(file)) return false;

  try {
    const content = JSON.parse(fs.readFileSync(file, "utf8")) as TopicContent;
    const review = content.editorial_review;
    return Boolean(
      review?.status === "reviewed" &&
        review.reviewed_by?.trim() &&
        review.reviewer_qualification?.trim() &&
        /^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_on ?? "") &&
        review.sources?.length &&
        review.sources.every((source) => {
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
        }),
    );
  } catch {
    return false;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedPages = ["/en", "/en/start-here", "/en/ontology", "/en/about-this-library"];
  const reviewedTopics = ontology.domains.flatMap((domain) =>
    domain.topics
      .filter((topic) => hasCompleteReview(topic.topic_id))
      .map((topic) => `/en/ontology/${topic.topic_id}`),
  );

  return [...fixedPages, ...reviewedTopics].map((pathname) => ({
    url: `https://learnaboutjainism.com${pathname}`,
  }));
}
