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
      <h1>Paryushana and Das Lakshana</h1>
      <p className="practice-page__lead">
        Jainpedia associates Paryuṣaṇa with Śvetāmbara communities and Daśa-lakṣaṇa with Digambara
        communities. Dates and observances vary by tradition and locality, so check with the Jain
        community whose practice you are studying.
      </p>

      <aside className="practice-warning">
        This page does not recommend fasting or give a fasting plan. Learn the form and meaning of an
        observance from the relevant Jain community and qualified teachers.
      </aside>

      <section>
        <h2>Why the details differ</h2>
        <p>
          Jainpedia notes that some festivals are shared while others are specific to a sect or local
          community. Communities may also use different festival lists. Dates follow Jain lunar
          calendars, so confirm current dates and local practice with the community whose observance
          you are studying.
        </p>
        <p>
          Introductions often mention reflection, religious study, forgiveness, and fasting. These
          descriptions give context; they are not instructions for an individual. This site does not
          advise whether or when someone should fast, or for how long.
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
            <span>Dates and observances vary among Jain communities.</span>
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
