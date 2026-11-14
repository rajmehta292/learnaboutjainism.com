import { Link } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

export default function EditorialNotice({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getMessages(locale);
  return (
    <aside className="editorial-notice" role="note" aria-label={copy.Navigation.statusLabel}>
      <span className="editorial-notice__label">{copy.Navigation.statusLabel}</span>
      <p>{copy.Editorial.draftCopy}</p>
      <Link href="/about-this-library">{copy.Navigation.statusLink}</Link>
    </aside>
  );
}
