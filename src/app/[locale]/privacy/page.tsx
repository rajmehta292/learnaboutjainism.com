import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { routing, type SiteLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.publishedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) return {};
  return {
    title: getMessages(locale).Privacy.title,
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  const copy = getMessages(locale).Privacy;
  const sections = [
    [copy.signinTitle, copy.signin],
    [copy.readingTitle, copy.reading],
    [copy.notesTitle, copy.notes],
    [copy.storageTitle, copy.storage],
    [copy.manageTitle, copy.manage],
    [copy.staffTitle, copy.staff],
    [copy.googleTitle, copy.google],
  ];

  return (
    <main className="editorial-page" id="main-content">
      <div className="site-container">
        <article className="editorial-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          {sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
