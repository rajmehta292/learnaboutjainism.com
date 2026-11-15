import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { routing, type SiteLocale } from "@/i18n/routing";
import FeedbackForm from "@/components/FeedbackForm";

export function generateStaticParams() {
  return routing.publishedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) return {};
  const copy = getMessages(locale).Feedback;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: { canonical: `/${locale}/feedback` },
    robots: { index: false, follow: false },
  };
}

export default async function FeedbackPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  const copy = getMessages(locale).Feedback;
  return (
    <main className="feedback-page" id="main-content">
      <div className="site-container feedback-page__layout">
        <header className="feedback-page__intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </header>
        <FeedbackForm copy={copy} />
      </div>
    </main>
  );
}
