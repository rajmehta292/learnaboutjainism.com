import { Link } from "@/i18n/routing";

export default function PracticeEntryDraft({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="practice-page practice-entry-draft" id="main-content">
      <p className="eyebrow">Practice entry · Review in progress</p>
      <h1>{title}</h1>
      <p>{description}</p>

      <section className="practice-placeholder-card" aria-label="Editorial status">
        <h2>Text and interpretation awaiting review</h2>
        <p>
          This page is not yet a reliable translation or ritual guide. We are checking its text,
          wording, and tradition-specific context against named editions and qualified human review.
          Detailed quotations and interpretations will appear after that review is recorded.
        </p>
      </section>

      <nav className="practice-draft-actions" aria-label="More information">
        <Link className="text-link" href="/about-this-library">How the review process works <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/ontology">Browse the topic library <span aria-hidden="true">→</span></Link>
      </nav>
    </main>
  );
}
