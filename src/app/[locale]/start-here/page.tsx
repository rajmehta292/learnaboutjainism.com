import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Link } from "@/i18n/routing";
import EditorialNotice from "@/components/EditorialNotice";
import learningPaths from "@/data/learningPaths.json";
import ontology from "@/data/ontology.json";

export const metadata: Metadata = {
  title: "Start here",
  description: "A calm, source-aware first route through Jain ideas, communities, and texts.",
};

const topicIndex = new Map(
  ontology.domains.flatMap((domain) =>
    domain.topics.map((topic) => [topic.topic_id, topic.title] as const),
  ),
);

function hasEntry(topicId: string) {
  return fs.existsSync(path.join(process.cwd(), "src", "data", "topics", `${topicId}.json`));
}

export default function StartHerePage() {
  return (
    <main id="main-content">
      <section className="page-intro page-intro--light">
        <div className="site-container page-intro__inner">
          <p className="eyebrow">A reader’s route</p>
          <h1>Start with a question.</h1>
          <p className="page-intro__lead">
            These short sequences connect topics across the catalogue. They are invitations to
            read, not lessons to complete or instructions for religious practice.
          </p>
          <Link className="text-link" href="/ontology">Browse every subject area <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="site-container start-paths" aria-label="Reading sequences">
        <EditorialNotice />
        {learningPaths.paths.map((readingPath, pathIndex) => (
          <article className="reading-path" key={readingPath.id}>
            <header className="reading-path__header">
              <span className="reading-path__number">{String(pathIndex + 1).padStart(2, "0")}</span>
              <div>
                <h2>{readingPath.title}</h2>
                <p>{readingPath.description}</p>
              </div>
            </header>
            <ol className="reading-path__topics">
              {readingPath.topic_ids.map((topicId) => {
                const title = topicIndex.get(topicId);
                if (!title) return null;
                const available = hasEntry(topicId);

                return (
                  <li key={topicId}>
                    <Link href={`/ontology/${topicId}`}>
                      <span>{title}</span>
                      <span className="topic-result__meta">{available ? "Draft entry" : "Entry in progress"}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </section>
    </main>
  );
}
