import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import EditorialNotice from "@/components/EditorialNotice";
import LibraryExplorer, { type LibraryDomain } from "@/components/LibraryExplorer";
import ontology from "@/data/ontology.json";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

const description =
  "Browse Jain philosophy, ethics, ahimsa, karma, history, scripture, literature, practice, and community diversity in a growing, source-aware topic library.";

export const metadata: Metadata = {
  title: "Topic library",
  description,
  alternates: { canonical: "/en/ontology" },
  openGraph: {
    title: "Topic library · Learn About Jainism",
    description,
    url: "/en/ontology",
    siteName: "Learn About Jainism",
    type: "website",
    images: openGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Topic library · Learn About Jainism",
    description,
    images: twitterImages,
  },
};

const domainGroups: Array<{ label: string; prefixes: string[] }> = [
  { label: "Foundations & philosophy", prefixes: ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12"] },
  { label: "Ethics & practice", prefixes: ["D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22"] },
  { label: "History & community", prefixes: ["D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30"] },
  { label: "Texts & literature", prefixes: ["D31", "D32", "D33", "D34", "D35", "D36", "D37"] },
  { label: "Arts & culture", prefixes: ["D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48"] },
  { label: "Research & reference", prefixes: ["D49", "D50", "D51", "D52"] },
];

const groupForDomain = new Map(
  domainGroups.flatMap((group) => group.prefixes.map((prefix) => [prefix, group.label] as const)),
);
const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");

const libraryDomains: LibraryDomain[] = ontology.domains.map((domain) => ({
  id: domain.domain_id,
  title: domain.domain,
  group: groupForDomain.get(domain.domain_id) ?? "Research & reference",
  topics: domain.topics.map((topic) => ({
    id: topic.topic_id,
    title: topic.title,
    hasEntry: fs.existsSync(path.join(topicsDirectory, `${topic.topic_id}.json`)),
  })),
}));

const topicCount = libraryDomains.reduce((total, domain) => total + domain.topics.length, 0);
const draftCount = libraryDomains.reduce(
  (total, domain) => total + domain.topics.filter((topic) => topic.hasEntry).length,
  0,
);

export default function LibraryPage() {
  return (
    <main id="main-content">
      <section className="library-hero">
        <div className="site-container">
          <p className="eyebrow">Explore the catalogue</p>
          <h1>The topic library</h1>
          <p className="library-hero__lead">
            Search by idea or browse a subject area. The catalogue is a map of questions to study;
            it does not mean every entry is complete or verified.
          </p>
          <div className="library-hero__stats" aria-label="Catalogue coverage">
            <span>{libraryDomains.length} subject areas</span>
            <span>{topicCount.toLocaleString("en-US")} catalogue topics</span>
            <span>{draftCount.toLocaleString("en-US")} draft entries</span>
          </div>
        </div>
      </section>

      <div className="site-container library-page">
        <EditorialNotice />
        <div className="library-explorer-wrap">
          <LibraryExplorer domains={libraryDomains} />
        </div>
      </div>
    </main>
  );
}
