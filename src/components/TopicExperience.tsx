"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Link } from "@/i18n/routing";
import ReadingTools from "@/components/ReadingTools";

type Source = Record<string, string | undefined> & { title?: string };
type TopicLink = { title: string; id: string };
type TopicContent = {
  title?: string;
  overview?: string;
  primary_sources?: Source[];
  editorial_review?: {
    status?: string;
    reviewed_by?: string;
    reviewer_qualification?: string;
    reviewed_on?: string;
    sources?: Source[];
  };
  misconceptions?: Array<{ myth: string; reality: string }>;
};

function escapeRegex(value: string) {
  const specialCharacters = new Set(".^$*+?()[]{}|\\");
  return [...value].map((character) => specialCharacters.has(character) ? `\\${character}` : character).join("");
}

function renderLinks(text: string, topicId: string, topicLinks: TopicLink[]): ReactNode[] {
  const matches = topicLinks.filter((topic) => topic.id !== topicId && topic.title.length > 3);
  if (!matches.length || !text) return [text];
  const expression = new RegExp(`\\b(${matches.map(({ title }) => escapeRegex(title)).join("|")})\\b`, "gi");
  const linked = new Set<string>();
  return text.split(expression).map((part, index) => {
    if (index % 2 === 0) return part;
    const topic = matches.find((item) => item.title.toLocaleLowerCase() === part.toLocaleLowerCase());
    if (!topic || linked.has(topic.id)) return part;
    linked.add(topic.id);
    return <Link key={`${topic.id}-${index}`} href={`/ontology/${topic.id}`} className="smart-link">{part}</Link>;
  });
}

function renderInline(text: string, topicId: string, topicLinks: TopicLink[]): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{renderLinks(part.slice(2, -2), topicId, topicLinks)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{renderLinks(part.slice(1, -1), topicId, topicLinks)}</em>;
    }
    return <Fragment key={index}>{renderLinks(part, topicId, topicLinks)}</Fragment>;
  });
}

export default function TopicExperience({
  topicId,
  title: originalTitle,
  domain,
  initialContent,
  topicLinks,
  initialNeedsReview,
  needsReviewLabel,
}: {
  topicId: string;
  title: string;
  domain: string;
  initialContent: TopicContent;
  topicLinks: TopicLink[];
  initialNeedsReview: boolean;
  needsReviewLabel: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [needsReview, setNeedsReview] = useState(initialNeedsReview);
  const title = content.title?.trim() || originalTitle;

  useEffect(() => {
    let active = true;
    fetch(`/api/content/${topicId}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!active || !result?.publishedContent || typeof result.publishedContent !== "object") return;
        setContent(result.publishedContent as TopicContent);
        setNeedsReview(false);
        document.title = `${String(result.publishedContent.title || originalTitle)} · Jainism`;
        const review = result.publishedContent.editorial_review;
        if (review?.status === "reviewed" && review.reviewed_by && review.reviewer_qualification && review.reviewed_on && Array.isArray(review.sources) && review.sources.length > 0) {
          document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [originalTitle, topicId]);

  const paragraphs = (content.overview ?? "").split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const reviewedSources = content.editorial_review?.sources;
  const sources = reviewedSources?.length ? reviewedSources : (content.primary_sources ?? []);

  return (
    <main id="main-content">
      <header className="article-hero">
        <div className="site-container article-hero__inner">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/ontology">Topic library</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
          {needsReview && <span className="topic-review-pill">{needsReviewLabel}</span>}
          <h1>{title}</h1>
          <p className="article-hero__domain">{domain}</p>
        </div>
      </header>

      <article className="article-body">
        <ReadingTools topicId={topicId} />
        {paragraphs.length > 0 ? (
          <div className="prose-reading">{paragraphs.map((paragraph, index) => <p key={index}>{renderInline(paragraph, topicId, topicLinks)}</p>)}</div>
        ) : <p className="empty-state">More on this topic will be added here.</p>}

        {sources.length > 0 && (
          <section className="verified-references" aria-labelledby="topic-sources-title">
            <h2 id="topic-sources-title">Sources and further reading</h2>
            <ul>{sources.map((source, index) => <li key={`${source.title ?? "source"}-${index}`}>
              {source.url?.startsWith("https://") ? <a href={source.url} target="_blank" rel="noreferrer">{source.title || "Untitled source"}</a> : <strong>{source.title || "Untitled source"}</strong>}
              {source.author && <p>{source.author}</p>}
              {source.transliteration && <p className="topic-source__transliteration">{source.transliteration}</p>}
              {source.translation && <p>{source.translation}</p>}
              {source.notes && <p>{source.notes}</p>}
              <p>{[source.source_type, source.tradition, source.edition, source.translator, source.locator].filter(Boolean).join(" · ")}</p>
            </li>)}</ul>
          </section>
        )}

        {content.misconceptions?.length ? (
          <section className="reviewed-misconceptions" aria-labelledby="topic-misunderstandings-title">
            <h2 id="topic-misunderstandings-title">Common questions</h2>
            <ul>{content.misconceptions.map((item, index) => <li key={index}><strong>{item.myth}</strong><p>{item.reality}</p></li>)}</ul>
          </section>
        ) : null}

        <nav className="article-footer" aria-label="Article navigation">
          <Link className="text-link" href="/ontology">← Back to the library</Link>
          <Link className="text-link" href="/about-this-library">About this library →</Link>
        </nav>
      </article>
    </main>
  );
}
