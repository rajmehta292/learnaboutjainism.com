"use client";

import { useEffect, useState, type FormEvent } from "react";

type FeedbackCopy = {
  typeLabel: string;
  typeCorrection: string;
  typeAccessibility: string;
  typeSuggestion: string;
  pageLabel: string;
  pageHint: string;
  detailsLabel: string;
  detailsHint: string;
  contextLabel: string;
  contextHint: string;
  publicNoticeTitle: string;
  publicNotice: string;
  submit: string;
  submitting: string;
  successTitle: string;
  success: string;
  successPending: string;
  successPreview: string;
  reference: string;
  issueLink: string;
  errorTitle: string;
  required: string;
  honeypot: string;
};

type Result = { received: boolean; reference?: string; githubSynced?: boolean; previewOnly?: boolean; issueUrl?: string; message?: string };

export default function FeedbackForm({ copy }: { copy: FeedbackCopy }) {
  const [type, setType] = useState("correction");
  const [pageUrl, setPageUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [supportingContext, setSupportingContext] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const requestedPage = new URLSearchParams(window.location.search).get("page");
    if (!requestedPage) return;
    const frame = window.requestAnimationFrame(() => setPageUrl(requestedPage.slice(0, 2000)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, pageUrl, feedback, supportingContext, website, formStartedAt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again shortly.");
      setResult(data as Result);
      setFeedback("");
      setSupportingContext("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Please try again shortly.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <section className="feedback-result" aria-labelledby="feedback-result-title" role="status">
        <span className="feedback-result__mark" aria-hidden="true">✓</span>
        <div>
          <h2 id="feedback-result-title">{copy.successTitle}</h2>
          <p>{result.previewOnly ? copy.successPreview : result.githubSynced ? copy.success : copy.successPending}</p>
          {result.reference && <p className="feedback-result__reference"><span>{copy.reference}</span> <code>{result.reference.slice(0, 8).toUpperCase()}</code></p>}
          {result.issueUrl && <a className="text-link" href={result.issueUrl} target="_blank" rel="noreferrer">{copy.issueLink} <span aria-hidden="true">↗</span></a>}
        </div>
      </section>
    );
  }

  return (
    <form className="feedback-form" onSubmit={submit}>
      <label className="feedback-form__field">
        <span>{copy.typeLabel}</span>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="correction">{copy.typeCorrection}</option>
          <option value="accessibility">{copy.typeAccessibility}</option>
          <option value="suggestion">{copy.typeSuggestion}</option>
        </select>
      </label>

      <label className="feedback-form__field">
        <span>{copy.pageLabel}</span>
        <input type="url" maxLength={2000} value={pageUrl} onChange={(event) => setPageUrl(event.target.value)} placeholder="https://learnaboutjainism.com/en/…" />
        <small>{copy.pageHint}</small>
      </label>

      <label className="feedback-form__field">
        <span>{copy.detailsLabel} <b aria-hidden="true">*</b></span>
        <textarea required minLength={8} maxLength={5000} rows={6} value={feedback} onChange={(event) => setFeedback(event.target.value)} aria-describedby="feedback-details-hint" />
        <small id="feedback-details-hint">{copy.detailsHint}</small>
      </label>

      <label className="feedback-form__field">
        <span>{copy.contextLabel}</span>
        <textarea maxLength={5000} rows={4} value={supportingContext} onChange={(event) => setSupportingContext(event.target.value)} aria-describedby="feedback-context-hint" />
        <small id="feedback-context-hint">{copy.contextHint}</small>
      </label>

      <label className="feedback-form__trap" aria-hidden="true" tabIndex={-1}>
        <span>{copy.honeypot}</span>
        <input autoComplete="off" tabIndex={-1} value={website} onChange={(event) => setWebsite(event.target.value)} />
      </label>

      <aside className="feedback-public-note">
        <strong>{copy.publicNoticeTitle}</strong>
        <p>{copy.publicNotice}</p>
      </aside>

      {error && <div className="feedback-form__error" role="alert"><strong>{copy.errorTitle}</strong><span>{error}</span></div>}

      <button className="button button--primary" type="submit" disabled={busy}>
        {busy ? copy.submitting : copy.submit}<span aria-hidden="true">{busy ? "…" : "→"}</span>
      </button>
    </form>
  );
}
