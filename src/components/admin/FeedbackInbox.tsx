"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackStatus = "new" | "triaged" | "in_progress" | "resolved" | "dismissed";
type FeedbackItem = {
  id: string;
  type: "correction" | "accessibility" | "suggestion";
  pageUrl: string;
  body: string;
  supportingContext: string;
  status: FeedbackStatus;
  assignee: string;
  staffNotes: string;
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  githubSyncState: "pending" | "sending" | "synced" | "failed" | "preview";
  githubSyncError: string;
  deliveryAttempts: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};
type HistoryEvent = { id: number; actor: string; action: string; status: FeedbackStatus; note: string; version: number; createdAt: string };
type Edit = { status: FeedbackStatus; assignee: string; staffNotes: string };

const labels: Record<FeedbackStatus, string> = {
  new: "New",
  triaged: "Triaged",
  in_progress: "In progress",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const typeLabels = {
  correction: "Correction or source issue",
  accessibility: "Accessibility barrier",
  suggestion: "Other suggestion",
};

function dateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

async function readJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request could not be completed.");
  return data;
}

function validLibraryPage(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "learnaboutjainism.com" || url.hostname.endsWith(".learnaboutjainism.pages.dev"));
  } catch { return false; }
}

export default function FeedbackInbox() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [filter, setFilter] = useState<"open" | "all" | FeedbackStatus>("open");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Record<string, HistoryEvent[]>>({});
  const [expanded, setExpanded] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const data = await readJson(await fetch("/api/admin/feedback", { cache: "no-store" }));
    setItems(data.items ?? []);
    setCounts(data.counts ?? {});
    setEdits(Object.fromEntries((data.items ?? []).map((item: FeedbackItem) => [item.id, { status: item.status, assignee: item.assignee, staffNotes: item.staffNotes }])));
  }

  useEffect(() => {
    let active = true;
    fetch("/api/admin/feedback", { cache: "no-store" }).then(readJson).then((data) => {
      if (!active) return;
      setItems(data.items ?? []);
      setCounts(data.counts ?? {});
      setEdits(Object.fromEntries((data.items ?? []).map((item: FeedbackItem) => [item.id, { status: item.status, assignee: item.assignee, staffNotes: item.staffNotes }])));
      const queryId = new URLSearchParams(window.location.search).get("item") ?? "";
      if (queryId && data.items?.some((item: FeedbackItem) => item.id === queryId)) {
        setExpanded(queryId);
        fetch(`/api/admin/feedback/${queryId}`, { cache: "no-store" }).then(readJson).then((detail) => {
          if (active) setHistory((current) => ({ ...current, [queryId]: detail.history ?? [] }));
        }).catch(() => undefined);
      }
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "The feedback inbox could not be loaded.");
    });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => items.filter((item) => {
    const open = item.status !== "resolved" && item.status !== "dismissed";
    const statusMatch = filter === "all" || (filter === "open" ? open : item.status === filter);
    const edit = edits[item.id];
    const search = `${typeLabels[item.type]} ${item.id} ${item.pageUrl} ${item.body} ${item.assignee} ${edit?.assignee ?? ""}`.toLowerCase();
    return statusMatch && search.includes(query.trim().toLowerCase());
  }), [items, edits, filter, query]);

  async function toggleHistory(id: string) {
    if (expanded === id) { setExpanded(""); return; }
    setExpanded(id);
    if (history[id]) return;
    try {
      const data = await readJson(await fetch(`/api/admin/feedback/${id}`, { cache: "no-store" }));
      setHistory((current) => ({ ...current, [id]: data.history ?? [] }));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load report history."); }
  }

  function updateEdit(id: string, key: keyof Edit, value: string) {
    setEdits((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  }

  async function save(item: FeedbackItem) {
    const edit = edits[item.id];
    if (!edit) return;
    setBusy(item.id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: item.version, ...edit, eventNote: `Status set to ${labels[edit.status]}.` }),
      });
      await readJson(response);
      await load();
      setHistory((current) => { const next = { ...current }; delete next[item.id]; return next; });
      setNotice("Feedback update saved to the shared review history.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this report."); }
    finally { setBusy(""); }
  }

  async function retrySync(item: FeedbackItem) {
    setBusy(item.id); setError(""); setNotice("");
    try {
      await readJson(await fetch(`/api/admin/feedback/${item.id}/sync`, { method: "POST" }));
      await load();
      setNotice("The GitHub issue is linked to this report.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not sync this report to GitHub."); }
    finally { setBusy(""); }
  }

  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">READER REPORTS · {items.length} SHOWN</p><h2>Feedback inbox</h2><p>Review corrections and access issues, assign a next step, and keep a record of the decision.</p></div></div>
      <div className="feedback-inbox-stats" aria-label="Feedback counts">
        <div><strong>{counts.new ?? 0}</strong><span>New</span></div>
        <div><strong>{counts.triaged ?? 0}</strong><span>Triaged</span></div>
        <div><strong>{counts.in_progress ?? 0}</strong><span>In progress</span></div>
        <div><strong>{counts.resolved ?? 0}</strong><span>Resolved</span></div>
      </div>
      {error && <div className="admin-alert" role="alert"><strong>Something needs attention</strong><span>{error}</span><button type="button" onClick={() => { setError(""); load().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not reload the inbox.")); }}>Reload inbox</button></div>}
      {notice && <p className="feedback-inbox-notice" role="status">{notice}</p>}
      <div className="admin-toolbar">
        <label className="admin-search"><span className="sr-only">Search reader feedback</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search report text, page, or assignee" /></label>
        <label className="admin-filter"><span className="sr-only">Filter reader feedback</span><select value={filter} onChange={(event) => setFilter(event.target.value as "open" | "all" | FeedbackStatus)}><option value="open">Open reports</option><option value="new">New</option><option value="triaged">Triaged</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option><option value="all">All reports</option></select></label>
      </div>
      <div className="admin-queue-summary"><span><strong>{visible.length}</strong> reports in this view</span><span>Latest 250 reports · public reports link to GitHub</span></div>
      <div className="feedback-inbox-list">
        {visible.map((item) => {
          const edit = edits[item.id] ?? { status: item.status, assignee: item.assignee, staffNotes: item.staffNotes };
          return <article className="feedback-card" key={item.id}>
            <header className="feedback-card__head">
              <div><span className={`feedback-type feedback-type--${item.type}`}>{typeLabels[item.type]}</span><h3>{item.pageUrl && validLibraryPage(item.pageUrl) ? <a href={item.pageUrl} target="_blank" rel="noreferrer">Page report ↗</a> : "Reader report"}</h3><p><code>{item.id.slice(0, 8).toUpperCase()}</code><span aria-hidden="true"> · </span><time dateTime={item.createdAt}>{dateTime(item.createdAt)}</time></p></div>
              <span className={`feedback-status feedback-status--${item.status}`}>{labels[item.status]}</span>
            </header>
            <p className="feedback-card__body">{item.body}</p>
            {item.supportingContext && <details className="feedback-card__context"><summary>Supporting source or context</summary><p>{item.supportingContext}</p></details>}
            <div className="feedback-card__github">
              {item.githubSyncState === "synced" && item.githubIssueUrl ? <a href={item.githubIssueUrl} target="_blank" rel="noreferrer">GitHub issue #{item.githubIssueNumber} ↗</a>
                : item.githubSyncState === "preview" ? <span>Preview only · not added to the public repository</span>
                  : item.githubSyncState === "sending" ? <span>GitHub sync is in progress</span>
                    : <><span>GitHub sync {item.githubSyncState}</span>{item.githubSyncState !== "pending" && <button type="button" className="admin-text-button" disabled={busy === item.id} onClick={() => retrySync(item)}>{busy === item.id ? "Retrying…" : "Retry sync"}</button>}</>}
            </div>
            {item.githubSyncError && item.githubSyncState === "failed" && <p className="feedback-card__error">{item.githubSyncError}</p>}
            <div className="feedback-card__controls">
              <label><span>Status</span><select value={edit.status} onChange={(event) => updateEdit(item.id, "status", event.target.value)}>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
              <label><span>Assigned librarian</span><input value={edit.assignee} maxLength={254} placeholder="Name or email" onChange={(event) => updateEdit(item.id, "assignee", event.target.value)} /></label>
              <label className="feedback-card__notes"><span>Staff notes · private to this workspace</span><textarea rows={3} maxLength={5000} value={edit.staffNotes} onChange={(event) => updateEdit(item.id, "staffNotes", event.target.value)} placeholder="What should happen next? What was checked?" /></label>
            </div>
            <footer className="feedback-card__footer">
              <button className="button button--quiet" type="button" disabled={busy === item.id} onClick={() => save(item)}>{busy === item.id ? "Saving…" : "Save review update"}</button>
              <button className="admin-text-button" type="button" aria-expanded={expanded === item.id} onClick={() => toggleHistory(item.id)}>{expanded === item.id ? "Hide history" : "View history"}</button>
              {item.updatedBy && <small>Last updated by {item.updatedBy} · {dateTime(item.updatedAt)}</small>}
            </footer>
            {expanded === item.id && <ol className="feedback-history">{history[item.id]?.length ? history[item.id].map((event) => <li key={event.id}><strong>{labels[event.status] ?? event.action.replaceAll("_", " ")}</strong><span>{event.actor} · {dateTime(event.createdAt)}</span>{event.note && <p>{event.note}</p>}</li>) : <li>No staff updates recorded yet.</li>}</ol>}
          </article>;
        })}
        {!visible.length && <div className="admin-card admin-empty-editor"><h3>No reports in this view</h3><p>Try another status or search term. New visitor reports will appear here.</p></div>}
      </div>
    </>
  );
}
