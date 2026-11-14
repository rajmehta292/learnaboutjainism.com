import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Link } from "@/i18n/routing";
import { englishHref, getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import EditorialNotice from "@/components/EditorialNotice";
import learningPaths from "@/data/learningPaths.json";
import ontology from "@/data/ontology.json";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Start;
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: { canonical: "/en/start-here" },
    openGraph: { title: `${copy.metadataTitle} · Learn About Jainism`, description: copy.metadataDescription, url: `/${locale}/start-here`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.metadataDescription, images: twitterImages },
  };
}

const topicIndex = new Map(
  ontology.domains.flatMap((domain) => domain.topics.map((topic) => [topic.topic_id, topic.title] as const)),
);

function hasEntry(topicId: string) {
  return fs.existsSync(path.join(process.cwd(), "src", "data", "topics", `${topicId}.json`));
}

export default async function StartHerePage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  const copy = getMessages(locale).Start;

  return (
    <main id="main-content">
      <section className="page-intro page-intro--light">
        <div className="site-container page-intro__inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
          <Link className="text-link" href="/ontology">{copy.browse} <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="site-container start-paths" aria-label={copy.ariaLabel}>
        <EditorialNotice locale={locale} />
        {locale !== "en" && <p className="translation-language-note">{copy.topicLanguageNote}</p>}
        {learningPaths.paths.map((readingPath, pathIndex) => {
          const localizedPath = copy.paths[pathIndex];
          if (!localizedPath) return null;

          return (
            <article className="reading-path" key={readingPath.id}>
              <header className="reading-path__header">
                <span className="reading-path__number">{String(pathIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{localizedPath.title}</h2>
                  <p>{localizedPath.description}</p>
                  {localizedPath.questions.length > 0 && (
                    <div className="reading-path__prompts">
                      <p className="reading-path__prompts-title">{copy.questionsLabel}</p>
                      <ul>{localizedPath.questions.map((question) => <li key={question}>{question}</li>)}</ul>
                    </div>
                  )}
                </div>
              </header>
              <ol className="reading-path__topics">
                {readingPath.topic_ids.map((topicId) => {
                  const title = topicIndex.get(topicId);
                  if (!title) return null;
                  const available = hasEntry(topicId);
                  return (
                    <li key={topicId}>
                      <Link href={englishHref(locale, `/ontology/${topicId}`)}>
                        <span>{title}</span>
                        <span className="topic-result__meta">{locale === "en" ? (available ? "Draft entry" : "Entry in progress") : (available ? copy.draftEntry : copy.entryProgress)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </section>
    </main>
  );
}
