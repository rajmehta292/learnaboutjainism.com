import { Link } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

export default function PracticeEntryDraft({
  slug,
  locale,
}: {
  slug: string;
  locale: SiteLocale;
}) {
  const copy = getMessages(locale).Practice;
  const entry = copy.entries.find((item) => item.slug === slug);
  if (!entry) return null;

  return (
    <main className="practice-page practice-entry-draft" id="main-content">
      <p className="eyebrow">{copy.entryEyebrow}</p>
      <span className="practice-review-badge">{copy.needsReview}</span>
      <h1>{entry.title}</h1>
      <p>{entry.description}</p>

      <nav className="practice-draft-actions" aria-label={copy.entryLabel}>
        <Link className="text-link" href="/aradhana">{copy.entryHeading} <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/ontology">{copy.browseTopics} <span aria-hidden="true">→</span></Link>
      </nav>
    </main>
  );
}
