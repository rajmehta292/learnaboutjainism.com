import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SiteLocale } from "@/i18n/routing";
import AdminWorkspace from "@/components/admin/AdminWorkspace";

export const metadata: Metadata = { title: "Review center", robots: { index: false, follow: false } };

export default async function ReviewCenterPage({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <AdminWorkspace section="review" />;
}
