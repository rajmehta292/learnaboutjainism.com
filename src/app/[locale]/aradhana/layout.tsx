import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function AradhanaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;
  const locale = localeValue as SiteLocale;
  const copy = getMessages(locale).Practice;

  return (
    <div className="practice-stage">
      <div className="site-container practice-stage__notice">
        <aside className="practice-notice" role="note" aria-label={copy.contextLabel}>
          <span>{copy.contextLabel}</span>
          <p>{copy.context}</p>
          <Link href="/about-this-library">{copy.reviewLink} <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
      {children}
    </div>
  );
}
