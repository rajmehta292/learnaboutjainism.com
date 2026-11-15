import type { Metadata } from "next";
import PracticeEntryDraft from "@/components/PracticeEntryDraft";
import TranslationInProgressContent from "@/components/TranslationInProgressContent";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getMessages(params.locale as SiteLocale).Practice.entries.map((entry) => ({ practice: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SiteLocale; practice: string }>;
}): Promise<Metadata> {
  const { locale, practice } = await params;
  const copy = getMessages(locale);
  const entry = copy.Practice.entries.find((item) => item.slug === practice);
  return {
    title: entry?.title ?? copy.Practice.metadataTitle,
    description: entry?.description ?? copy.Practice.description,
    robots: { index: false, follow: true },
    openGraph: { title: entry?.title ?? copy.Practice.metadataTitle, description: entry?.description ?? copy.Practice.description, url: `/${locale}/aradhana/${practice}`, siteName: "Learn About Jainism", type: "article", images: openGraphImages },
    twitter: { card: "summary_large_image", title: entry?.title ?? copy.Practice.metadataTitle, description: entry?.description ?? copy.Practice.description, images: twitterImages },
  };
}

function ParyushanaEnglish() {
  return (
    <main className="practice-page" id="main-content">
      <p className="eyebrow">Ārādhana · Annual observances</p>
      <span className="practice-review-badge">{getMessages("en").Navigation.needsReview}</span>
      <h1>Paryushana and Das Lakshana</h1>
      <p className="practice-page__lead">
        Jainpedia describes Paryuṣaṇa as an observance in Śvetāmbara communities and Daśa-lakṣaṇa
        as an observance in Digambara communities. Dates and customs vary by region and community.
      </p>

      <aside className="practice-warning">
        Fasting can affect health. Speak with a healthcare professional before fasting, and ask a
        Jain teacher about the religious observance.
      </aside>

      <section>
        <h2>How observances differ</h2>
        <p>
          Jain communities follow different festival calendars and practices. Dates follow Jain
          lunar calendars, so they can differ by region and year. Check local dates with the community
          whose observance you are studying.
        </p>
        <p>
          These observances can include reflection, religious study, forgiveness, and fasting. Local
          customs differ, so ask someone in the relevant community about its practice.
        </p>
      </section>

      <section>
        <h2>Further reading</h2>
        <ul className="practice-references">
          <li>
            <a href="https://jainpedia.org/article/themes/practices/festivals/" target="_blank" rel="noreferrer">“Festivals,” Jainpedia</a>
            <span>Overview of Jain festivals, with notes on community and calendar differences.</span>
          </li>
          <li>
            <a href="https://parliamentofreligions.org/articles/introspection-and-forgiveness-the-jain-celebration-of-paryushan-and-das-lakshan/" target="_blank" rel="noreferrer">“Introspection and Forgiveness: The Jain Celebration of Paryushan and Das Lakshan,” Parliament of the World’s Religions</a>
            <span>Article on Paryuṣaṇa, Daśa-lakṣaṇa, and Jain festivals.</span>
          </li>
        </ul>
      </section>

    </main>
  );
}

export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ locale: SiteLocale; practice: string }>;
}) {
  const { locale, practice } = await params;

  if (practice === "paryushana" && locale !== "en") {
    return (
      <TranslationInProgressContent
        copy={getMessages(locale).Pending}
        initialSource="/aradhana/paryushana"
      />
    );
  }

  if (practice === "paryushana") return <ParyushanaEnglish />;
  return <PracticeEntryDraft slug={practice} locale={locale} />;
}
