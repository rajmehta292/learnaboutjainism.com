import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import LibraryExplorer, { type LibraryDomain } from "@/components/LibraryExplorer";
import ontology from "@/data/ontology.json";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

const domainGroups = [
  { key: "foundations", prefixes: ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12"] },
  { key: "ethics", prefixes: ["D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22"] },
  { key: "history", prefixes: ["D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30"] },
  { key: "texts", prefixes: ["D31", "D32", "D33", "D34", "D35", "D36", "D37"] },
  { key: "arts", prefixes: ["D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48"] },
  { key: "research", prefixes: ["D49", "D50"] },
] as const;

const groupForDomain = new Map<string, LibraryDomain["groupKey"]>(
  domainGroups.flatMap((group) => group.prefixes.map((prefix) => [prefix, group.key] as const)),
);
const topicsDirectory = path.join(process.cwd(), "src", "data", "topics");

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Library;
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: { canonical: "/en/ontology" },
    openGraph: { title: `${copy.metadataTitle} · Learn About Jainism`, description: copy.metadataDescription, url: `/${locale}/ontology`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.metadataDescription, images: twitterImages },
  };
}

export default async function LibraryPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  const copy = getMessages(locale).Library;
  const libraryDomains: LibraryDomain[] = ontology.domains.map((domain) => {
    const domainKey = domain.domain_id as keyof typeof copy.domainTitles;
    return {
      id: domain.domain_id,
      originalTitle: domain.domain,
      title: copy.domainTitles[domainKey] ?? domain.domain,
      groupKey: groupForDomain.get(domain.domain_id) ?? "research",
      topics: domain.topics.map((topic) => ({
        id: topic.topic_id,
        title: topic.title,
        hasEntry: fs.existsSync(path.join(topicsDirectory, `${topic.topic_id}.json`)),
      })),
    };
  });

  const topicCount = libraryDomains.reduce((total, domain) => total + domain.topics.length, 0);
  const numberLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-US";

  return (
    <main id="main-content">
      <section className="library-hero">
        <div className="site-container">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="library-hero__lead">{copy.lead}</p>
          <div className="library-hero__stats" aria-label={copy.statsLabel}>
            <span>{libraryDomains.length.toLocaleString(numberLocale)} {copy.subjectAreas}</span>
            <span>{topicCount.toLocaleString(numberLocale)} {copy.topicCountLabel}</span>
          </div>
        </div>
      </section>

      <div className="site-container library-page">
        <div className="library-explorer-wrap">
          <LibraryExplorer domains={libraryDomains} copy={copy} locale={locale} />
        </div>
      </div>
    </main>
  );
}
