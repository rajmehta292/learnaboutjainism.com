import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SignInPanel from "@/components/SignInPanel";
import type { SiteLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.publishedLocales.map((locale) => ({ locale }));
}

export default async function SignInPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  return <SignInPanel />;
}
