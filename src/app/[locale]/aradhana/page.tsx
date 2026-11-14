import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Practice;
  return {
    title: copy.metadataTitle,
    description: copy.description,
    robots: { index: false, follow: true },
    openGraph: { title: copy.metadataTitle, description: copy.description, url: `/${locale}/aradhana`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.description, images: twitterImages },
  };
}

export default async function AradhanaIndex({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  const copy = getMessages(locale).Practice;

  return (
    <main className="practice-page practice-index" id="main-content">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p className="practice-page__lead">{copy.description}</p>

      <section aria-labelledby="practice-entry-list-title">
        <h2 id="practice-entry-list-title">{copy.sectionTitle}</h2>
        <div className="practice-entry-grid">
          {copy.entries.map((entry) => (
            <Link className="practice-entry-card" href={`/aradhana/${entry.slug}`} key={entry.slug}>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <span>{copy.openEntry} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <p className="practice-page__closing">
        <Link href="/about-this-library">{copy.reviewLink} <span aria-hidden="true">→</span></Link>
      </p>
    </main>
  );
}
