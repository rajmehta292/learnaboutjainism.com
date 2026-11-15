import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AccountDashboard from "@/components/AccountDashboard";
import type { SiteLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Your reading account",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.publishedLocales.map((locale) => ({ locale }));
}

export default async function AccountPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  return <AccountDashboard />;
}
