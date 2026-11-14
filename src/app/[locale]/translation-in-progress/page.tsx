import type { Metadata } from "next";
import TranslationInProgressContent from "@/components/TranslationInProgressContent";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Pending;
  return {
    title: copy.metadataTitle,
    description: copy.description,
    robots: { index: false, follow: true },
    openGraph: { title: copy.metadataTitle, description: copy.description, url: `/${locale}/translation-in-progress`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.description, images: twitterImages },
  };
}

export default async function TranslationInProgressPage({
  params,
}: {
  params: Promise<{ locale: SiteLocale }>;
}) {
  const { locale } = await params;
  return <TranslationInProgressContent copy={getMessages(locale).Pending} />;
}
