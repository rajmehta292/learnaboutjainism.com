"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import FeedbackInbox from "@/components/admin/FeedbackInbox";
import ReviewWorkflow from "@/components/admin/ReviewWorkflow";

type Status = "needs_review" | "in_review" | "verified";
type TopicRecord = {
  topicId: string;
  title: string;
  domain: string;
  hasPage: boolean;
  initialStatus: Status;
  sourceCount: number;
  overviewWords: number;
};
type Task = {
  topicId: string;
  status: Status;
  assignee: string;
  notes: string;
  version: number;
  updatedAt?: string;
  updatedBy?: string;
  hasDraft?: number;
};
type RecentFeedback = {
  id: string;
  type: "correction" | "accessibility" | "suggestion";
  pageUrl: string;
  body: string;
  status: string;
  githubSyncState: string;
  createdAt: string;
};
type AdminSummary = {
  savedDrafts: number;
  feedbackTotal: number;
  feedbackNew: number;
  feedbackActive: number;
  feedbackStatuses: Record<string, number>;
  recentFeedback: RecentFeedback[];
};
type HistoryEvent = {
  id: number;
  actor: string;
  action: string;
  status: Status;
  note: string;
  version: number;
  createdAt: string;
  hasSnapshot: number;
};
type PageContent = Record<string, unknown> & { title: string; overview?: string };
type PageDetail = {
  task: Task & { draftContent: PageContent | null; hasPublishedContent: boolean };
  history: HistoryEvent[];
};
type Section = "overview" | "review" | "pages" | "edit" | "feedback" | "workflow";

const ADMIN_ROOT = "/en/admin";

async function responseJson(response: Response) {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new Error("The editor service did not return data. Sign in again, then refresh the page.");
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || "The request could not be completed.");
  return value;
}

function statusOf(record: TopicRecord, tasks: Map<string, Task>): Status {
  return tasks.get(record.topicId)?.status ?? record.initialStatus;
}

function StatusBadge({ status }: { status: Status }) {
  const label = status === "verified" ? "Verified" : status === "in_review" ? "In review" : "Needs review";
  return <span className={`admin-status admin-status--${status}`}>{label}</span>;
}

function EntryStatus({ record }: { record: DashboardRecord }) {
  return record.hasPage
    ? <StatusBadge status={record.status} />
    : <span className="admin-status admin-status--missing">Content needed</span>;
}

function dateLabel(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function citationIsComplete(source: Record<string, unknown>) {
  if (!String(source.title ?? "").trim() || !String(source.source_type ?? "").trim() || !String(source.locator ?? "").trim()) return false;
  try { return new URL(String(source.url ?? "")).protocol === "https:"; } catch { return false; }
}

function topicHref(topicId: string) {
  return `${ADMIN_ROOT}/edit?topic_id=${encodeURIComponent(topicId)}`;
}

export default function AdminWorkspace({ section }: { section: Section }) {
  const [records, setRecords] = useState<TopicRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState("");
  const [authMethod, setAuthMethod] = useState("");
  const [summary, setSummary] = useState<AdminSummary>({ savedDrafts: 0, feedbackTotal: 0, feedbackNew: 0, feedbackActive: 0, feedbackStatuses: {}, recentFeedback: [] });
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<PageDetail | null>(null);
  const [baseContent, setBaseContent] = useState<PageContent | null>(null);
  const [baseContentTopicId, setBaseContentTopicId] = useState("");
  const [loading, setLoading] = useState(true);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [error, setError] = useState("");

  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.topicId, task])), [tasks]);
  const recordsWithStatus = useMemo(() => records.map((record) => ({ ...record, status: statusOf(record, taskMap), task: taskMap.get(record.topicId) })), [records, taskMap]);
  const selectedRecord = records.find((record) => record.topicId === selectedId);

  async function reloadWorkspace() {
    const compact = section === "feedback" || section === "workflow";
    const [manifestResponse, stateResponse] = await Promise.all([
      compact ? Promise.resolve(null) : fetch("/content-review-index.json", { cache: "no-store" }),
      fetch(`/api/admin/state${compact ? "?summary=1" : ""}`, { cache: "no-store" }),
    ]);
    const manifest = manifestResponse ? await responseJson(manifestResponse) : { topics: [] };
    const state = await responseJson(stateResponse);
    if (!compact) setRecords(Array.isArray(manifest.topics) ? manifest.topics : []);
    setTasks(Array.isArray(state.tasks) ? state.tasks : []);
    setSummary(state.summary ?? { savedDrafts: 0, feedbackTotal: 0, feedbackNew: 0, feedbackActive: 0, feedbackStatuses: {}, recentFeedback: [] });
    setUser(typeof state.user === "string" ? state.user : "");
    setAuthMethod(typeof state.authMethod === "string" ? state.authMethod : "Cloudflare Access");
    setWorkspaceReady(true);
  }

  useEffect(() => {
    let active = true;
    const compact = section === "feedback" || section === "workflow";
    Promise.all([
      compact ? Promise.resolve({ topics: [] }) : fetch("/content-review-index.json", { cache: "no-store" }).then(responseJson),
      fetch(`/api/admin/state${compact ? "?summary=1" : ""}`, { cache: "no-store" }).then(responseJson),
    ]).then(([manifest, state]) => {
      if (!active) return;
      if (!compact) setRecords(Array.isArray(manifest.topics) ? manifest.topics : []);
      setTasks(Array.isArray(state.tasks) ? state.tasks : []);
      setSummary(state.summary ?? { savedDrafts: 0, feedbackTotal: 0, feedbackNew: 0, feedbackActive: 0, feedbackStatuses: {}, recentFeedback: [] });
      setUser(typeof state.user === "string" ? state.user : "");
      setAuthMethod(typeof state.authMethod === "string" ? state.authMethod : "Cloudflare Access");
      setWorkspaceReady(true);
      const queryId = new URLSearchParams(window.location.search).get("topic_id") ?? "";
      if (queryId && /^D\d{2}\.T\d{3}$/.test(queryId)) setSelectedId(queryId);
      setLoading(false);
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(reason instanceof Error ? reason.message : "The editorial workspace could not be loaded.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [section]);

  useEffect(() => {
    if (section !== "edit" || !selectedId) {
      return;
    }
    let active = true;
    Promise.all([
      fetch(`/api/admin/topic/${selectedId}`, { cache: "no-store" }).then(responseJson),
      selectedRecord?.hasPage
        ? fetch(`/topic-data/${selectedId}.json`, { cache: "no-store" }).then(responseJson)
        : Promise.resolve({ title: selectedRecord?.title ?? selectedId, overview: "", primary_sources: [] }),
    ]).then(([pageDetail, base]) => {
      if (!active) return;
      setDetail(pageDetail);
      setBaseContent(base);
      setBaseContentTopicId(selectedId);
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(reason instanceof Error ? reason.message : "This page could not be opened.");
    });
    return () => { active = false; };
  }, [section, selectedId, selectedRecord]);

  const existingPages = recordsWithStatus.filter((record) => record.hasPage);
  const needsReview = existingPages.filter((record) => record.status === "needs_review").length;
  const inReview = existingPages.filter((record) => record.status === "in_review").length;
  const verified = existingPages.filter((record) => record.status === "verified").length;
  const contentNeeded = recordsWithStatus.length - existingPages.length;
  const nextPage = recordsWithStatus.find((record) => record.status === "needs_review" && record.hasPage)
    ?? recordsWithStatus.find((record) => record.status === "in_review" && record.hasPage);

  return (
    <main className="admin-page" id="main-content">
      <div className="admin-wrap">
        <header className="admin-heading">
          <div>
            <p className="eyebrow">JAINISM LEARNING LIBRARY · EDITORIAL</p>
            <h1>Library workspace</h1>
            <p>Keep pages moving from first read to a checked, published entry.</p>
          </div>
          <div className="admin-account">
            <span className="admin-account__avatar" aria-hidden="true">{user ? user.slice(0, 1).toUpperCase() : "J"}</span>
            <span><strong>{user || "Librarian access"}</strong><small>{user ? `Signed in with ${authMethod}` : "Sign in to manage review"}</small></span>
          </div>
        </header>

        <div className="admin-layout">
          <aside className="admin-sidebar" aria-label="Workspace navigation">
            <span className="admin-sidebar__label">WORKSPACE</span>
            <a className={section === "overview" ? "is-active" : ""} href={ADMIN_ROOT}>Overview</a>
            <a className={section === "review" ? "is-active" : ""} href={`${ADMIN_ROOT}/review`}>Review center <span>{needsReview + inReview}</span></a>
            <a className={section === "pages" ? "is-active" : ""} href={`${ADMIN_ROOT}/pages`}>All pages</a>
            <a className={section === "feedback" ? "is-active" : ""} href={`${ADMIN_ROOT}/feedback`}>Reader feedback <span>{summary.feedbackNew}</span></a>
            <span className="admin-sidebar__label admin-sidebar__label--second">TOOLS</span>
            <a className={section === "edit" ? "is-active" : ""} href={`${ADMIN_ROOT}/edit`}>Page editor</a>
            <a className={section === "workflow" ? "is-active" : ""} href={`${ADMIN_ROOT}/workflow`}>Review workflow</a>
            <div className="admin-sidebar__help">
              <strong>Shared workspace</strong>
              <p>Assignments, changes, and review notes are saved for the whole team.</p>
            </div>
          </aside>

          <section className="admin-content">
            {error && workspaceReady && <div className="admin-alert" role="alert"><strong>Could not load the workspace</strong><span>{error}</span><button type="button" onClick={() => window.location.reload()}>Reload</button></div>}
            {loading ? <div className="admin-loading">Opening the library workspace…</div> : !workspaceReady ? (
              <div className="admin-alert" role="alert">
                <strong>Sign in to open the librarian workspace</strong>
                <span>{error || "Confirm librarian access, then reload this page."}</span>
                <Link className="admin-quiet-link" href="/en/sign-in?return_to=%2Fen%2Fadmin">Librarian sign-in</Link>
                <button type="button" onClick={() => window.location.reload()}>Try again</button>
              </div>
            ) : (
              <>
                {section === "overview" && <Overview records={recordsWithStatus} needsReview={needsReview} inReview={inReview} verified={verified} contentNeeded={contentNeeded} nextPage={nextPage} summary={summary} />}
                {section === "review" && <ReviewCenter records={recordsWithStatus.filter((record) => record.hasPage)} />}
                {section === "pages" && <PagesTracker records={recordsWithStatus} />}
                {section === "feedback" && <FeedbackInbox />}
                {section === "workflow" && <ReviewWorkflow />}
                {section === "edit" && (
                  <EditorPanel
                    key={`${selectedId}:${detail?.task.topicId === selectedId ? "loaded" : "loading"}`}
                    records={records}
                    record={selectedRecord}
                    detail={detail}
                    baseContent={baseContentTopicId === selectedId ? baseContent : null}
                    loading={Boolean(selectedId && (!detail || detail.task.topicId !== selectedId) && !error)}
                    onSelect={(topicId) => { setError(""); setSelectedId(topicId); }}
                    onRefresh={async () => { await reloadWorkspace(); }}
                    onDetail={(value) => setDetail(value)}
                    onError={setError}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

type DashboardRecord = TopicRecord & { status: Status; task?: Task };

function Overview({ records, needsReview, inReview, verified, contentNeeded, nextPage, summary }: {
  records: DashboardRecord[]; needsReview: number; inReview: number; verified: number; contentNeeded: number; nextPage?: DashboardRecord; summary: AdminSummary;
}) {
  const articleCount = records.filter((record) => record.hasPage).length;
  const recent = records.filter((record) => record.task?.updatedAt).sort((a, b) => String(b.task?.updatedAt).localeCompare(String(a.task?.updatedAt))).slice(0, 5);
  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">YOUR LIBRARY, AT A GLANCE</p><h2>Overview</h2><p>See what is ready, what is being checked, and where to begin.</p></div></div>
      <div className="admin-stats">
        <article><span className="admin-stat-icon admin-stat-icon--gold">↗</span><span className="admin-stat-label">Needs review</span><strong>{needsReview.toLocaleString()}</strong><small>Articles waiting for a first review</small></article>
        <article><span className="admin-stat-icon admin-stat-icon--sage">◷</span><span className="admin-stat-label">In review</span><strong>{inReview.toLocaleString()}</strong><small>Pages currently being worked on</small></article>
        <article><span className="admin-stat-icon admin-stat-icon--gold">✎</span><span className="admin-stat-label">Saved drafts</span><strong>{summary.savedDrafts.toLocaleString()}</strong><small>Working copies saved for the team</small></article>
        <article><span className="admin-stat-icon admin-stat-icon--neutral">↺</span><span className="admin-stat-label">New feedback</span><strong>{summary.feedbackNew.toLocaleString()}</strong><small>Reader reports awaiting triage</small></article>
        <article><span className="admin-stat-icon admin-stat-icon--ink">✓</span><span className="admin-stat-label">Verified</span><strong>{verified.toLocaleString()}</strong><small>Pages published after review</small></article>
        <article><span className="admin-stat-icon admin-stat-icon--neutral">＋</span><span className="admin-stat-label">Content needed</span><strong>{contentNeeded.toLocaleString()}</strong><small>Topics without an article yet</small></article>
      </div>
      <section className="admin-card admin-flow-preview" aria-labelledby="admin-flow-title">
        <div className="admin-card-heading"><div><p className="eyebrow">FROM REPORT TO REVISION</p><h3 id="admin-flow-title">A clear review path</h3></div><a className="admin-quiet-link" href={`${ADMIN_ROOT}/workflow`}>Read the workflow →</a></div>
        <ol className="admin-flow-preview__steps">
          <li><span>01</span><strong>Receive</strong><small>{summary.feedbackTotal.toLocaleString()} reader reports</small></li>
          <li><span>02</span><strong>Assign</strong><small>Give a librarian the next action</small></li>
          <li><span>03</span><strong>Check</strong><small>Compare claims with cited sources</small></li>
          <li><span>04</span><strong>Revise</strong><small>Save a shared draft and notes</small></li>
          <li><span>05</span><strong>Publish</strong><small>Record the decision in page history</small></li>
        </ol>
      </section>
      <div className="admin-overview-grid">
        <section className="admin-card admin-next-card">
          <p className="eyebrow">NEXT UP</p>
          <h3>{nextPage?.title ?? "The review queue is clear"}</h3>
          <p>{nextPage ? `${nextPage.domain} · ${nextPage.topicId}` : "All available entries have been reviewed."}</p>
          {nextPage && <a className="button button--primary" href={topicHref(nextPage.topicId)}>Open review <span aria-hidden="true">→</span></a>}
          <a className="admin-quiet-link" href={`${ADMIN_ROOT}/review`}>Go to review center <span aria-hidden="true">→</span></a>
        </section>
        <section className="admin-card admin-progress-card">
          <div className="admin-card-heading"><div><p className="eyebrow">LIBRARY PROGRESS</p><h3>Article review</h3></div><span>{articleCount.toLocaleString()} articles</span></div>
          <div className="admin-progress-track" role="img" aria-label={`${verified} of ${articleCount} articles verified`}><span style={{ width: `${articleCount ? (verified / articleCount) * 100 : 0}%` }} /></div>
          <p><strong>{verified.toLocaleString()}</strong> verified <span aria-hidden="true">·</span> {needsReview.toLocaleString()} to review</p>
        </section>
      </div>
      <section className="admin-card admin-recent">
        <div className="admin-card-heading"><div><p className="eyebrow">TEAM ACTIVITY</p><h3>Recently updated</h3></div><a className="admin-quiet-link" href={`${ADMIN_ROOT}/pages`}>View all pages →</a></div>
        {recent.length ? <div className="admin-recent-list">{recent.map((record) => <a key={record.topicId} href={topicHref(record.topicId)}><span className="admin-recent-list__title"><strong>{record.title}</strong><small>{record.topicId} · {record.task?.updatedBy}</small></span><EntryStatus record={record} /><time>{dateLabel(record.task?.updatedAt)}</time></a>)}</div> : <p className="admin-empty">Page activity will appear here as the team saves work.</p>}
      </section>
      <section className="admin-card admin-feedback-recent">
        <div className="admin-card-heading"><div><p className="eyebrow">READER REPORTS</p><h3>Latest feedback</h3></div><a className="admin-quiet-link" href={`${ADMIN_ROOT}/feedback`}>Open inbox →</a></div>
        {summary.recentFeedback.length ? <div className="admin-feedback-recent__list">{summary.recentFeedback.map((item) => <a key={item.id} href={`${ADMIN_ROOT}/feedback?item=${item.id}`}><span><strong>{item.type === "correction" ? "Correction or source issue" : item.type === "accessibility" ? "Accessibility barrier" : "Other suggestion"}</strong><small>{item.body}</small></span><time>{dateLabel(item.createdAt)}</time></a>)}</div> : <p className="admin-empty">Reader reports will appear here when someone submits one.</p>}
      </section>
    </>
  );
}

function ReviewCenter({ records }: { records: DashboardRecord[] }) {
  const [filter, setFilter] = useState<"active" | Status>("active");
  const [query, setQuery] = useState("");
  const filtered = records.filter((record) => {
    const statusMatches = filter === "active" ? record.status !== "verified" : record.status === filter;
    const text = `${record.title} ${record.topicId} ${record.domain} ${record.task?.assignee ?? ""}`.toLowerCase();
    return statusMatches && text.includes(query.toLowerCase().trim());
  });
  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">ONE PAGE AT A TIME</p><h2>Review center</h2><p>Open an entry, compare its citations, add a note, then publish the checked version.</p></div></div>
      <div className="admin-toolbar"><label className="admin-search"><span className="sr-only">Search review queue</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages, topics, or editors" /></label><label className="admin-filter"><span className="sr-only">Filter status</span><select value={filter} onChange={(event) => setFilter(event.target.value as "active" | Status)}><option value="active">All open reviews</option><option value="needs_review">Needs review</option><option value="in_review">In review</option><option value="verified">Verified</option></select></label></div>
      <div className="admin-queue-summary"><span><strong>{filtered.length.toLocaleString()}</strong> pages in this view</span><span>Open an entry to work through it and record the review.</span></div>
      <PageTable records={filtered} showUpdated={false} />
    </>
  );
}

function PagesTracker({ records }: { records: DashboardRecord[] }) {
  const [filter, setFilter] = useState<"all" | Status | "content_needed">("all");
  const [query, setQuery] = useState("");
  const filtered = records.filter((record) => {
    const statusMatches = filter === "all" || (filter === "content_needed" ? !record.hasPage : record.hasPage && record.status === filter);
    const text = `${record.title} ${record.topicId} ${record.domain} ${record.task?.assignee ?? ""}`.toLowerCase();
    return statusMatches && text.includes(query.toLowerCase().trim());
  });
  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">ASSIGNMENTS AND STATUS</p><h2>All pages</h2><p>Track every library entry, its current reviewer, and the latest activity.</p></div></div>
      <div className="admin-toolbar"><label className="admin-search"><span className="sr-only">Search all pages</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, ID, subject, or editor" /></label><label className="admin-filter"><span className="sr-only">Filter page status</span><select value={filter} onChange={(event) => setFilter(event.target.value as "all" | Status | "content_needed")}><option value="all">Every status</option><option value="needs_review">Needs review</option><option value="in_review">In review</option><option value="verified">Verified</option><option value="content_needed">Content needed</option></select></label></div>
      <div className="admin-queue-summary"><span><strong>{filtered.length.toLocaleString()}</strong> of {records.length.toLocaleString()} pages</span><span>Assignments are shared across the team.</span></div>
      <PageTable records={filtered} showUpdated />
    </>
  );
}

function PageTable({ records, showUpdated }: { records: DashboardRecord[]; showUpdated: boolean }) {
  return (
    <div className="admin-table-frame">
      <table className="admin-table">
        <thead><tr><th scope="col">Page</th><th scope="col">Status</th><th scope="col">Assigned to</th>{showUpdated && <th scope="col">Updated</th>}<th scope="col"><span className="sr-only">Action</span></th></tr></thead>
        <tbody>{records.map((record) => <tr key={record.topicId}>
          <td data-label="Page"><a className="admin-table-title" href={topicHref(record.topicId)}>{record.title}</a><span className="admin-table-subtitle">{record.topicId} <span aria-hidden="true">·</span> {record.domain}</span></td>
          <td data-label="Status"><EntryStatus record={record} /></td>
          <td data-label="Assigned to" className="admin-table-assignee">{record.task?.assignee || <span className="admin-muted">Unassigned</span>}</td>
          {showUpdated && <td data-label="Updated" className="admin-table-date">{dateLabel(record.task?.updatedAt)}</td>}
          <td data-label="Action"><a className="admin-table-action" href={topicHref(record.topicId)}>{!record.hasPage ? "Create" : record.status === "verified" ? "Open" : "Review"} <span aria-hidden="true">→</span></a></td>
        </tr>)}</tbody>
      </table>
      {!records.length && <div className="admin-empty admin-empty--table">No pages match these filters.</div>}
    </div>
  );
}

function EditorPanel({ records, record, detail, baseContent, loading, onSelect, onRefresh, onDetail, onError }: {
  records: TopicRecord[];
  record?: TopicRecord;
  detail: PageDetail | null;
  baseContent: PageContent | null;
  loading: boolean;
  onSelect: (topicId: string) => void;
  onRefresh: () => Promise<void>;
  onDetail: (detail: PageDetail) => void;
  onError: (message: string) => void;
}) {
  const matchingDetail = detail?.task.topicId === record?.topicId ? detail : null;
  const initialContent = matchingDetail?.task.draftContent ?? baseContent;
  const [title, setTitle] = useState(String(initialContent?.title ?? record?.title ?? ""));
  const [overview, setOverview] = useState(String(initialContent?.overview ?? ""));
  const [rawJson, setRawJson] = useState(initialContent ? JSON.stringify(initialContent, null, 2) : "");
  const [assignment, setAssignment] = useState(matchingDetail?.task.assignee ?? "");
  const [notes, setNotes] = useState(matchingDetail?.task.notes ?? "");
  const [checkedSources, setCheckedSources] = useState<boolean[]>([]);
  const [pageChecked, setPageChecked] = useState(false);
  const initialReview = initialContent?.editorial_review as { reviewer_qualification?: string } | undefined;
  const [qualification, setQualification] = useState(initialReview?.reviewer_qualification ?? "");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");

  const parsedJson = useMemo(() => {
    try {
      const value = JSON.parse(rawJson);
      return value && typeof value === "object" && !Array.isArray(value) ? value as PageContent : null;
    } catch { return null; }
  }, [rawJson]);
  const effectiveContent = useMemo<PageContent | null>(() => parsedJson ? { ...parsedJson, title, overview } : null, [parsedJson, title, overview]);
  const sources = useMemo(() => {
    const editorial = effectiveContent?.editorial_review as { sources?: Array<Record<string, unknown>> } | undefined;
    const primary = effectiveContent?.primary_sources;
    if (Array.isArray(editorial?.sources) && editorial.sources.length) return editorial.sources;
    return Array.isArray(primary) ? primary as Array<Record<string, unknown>> : [];
  }, [effectiveContent]);
  const version = detail?.task.version ?? 0;

  function updateSourceField(index: number, field: "url" | "source_type" | "locator", value: string) {
    if (!parsedJson) return;
    const review = parsedJson.editorial_review as Record<string, unknown> | undefined;
    const reviewSources = review?.sources;
    const inReview = Array.isArray(reviewSources) && reviewSources.length > 0;
    const currentSources = inReview ? reviewSources : parsedJson.primary_sources;
    if (!Array.isArray(currentSources)) return;
    const updatedSources = currentSources.map((source, sourceIndex) => sourceIndex === index && source && typeof source === "object"
      ? { ...source, [field]: value }
      : source);
    const updatedContent = inReview
      ? { ...parsedJson, editorial_review: { ...review, sources: updatedSources } }
      : { ...parsedJson, primary_sources: updatedSources };
    setRawJson(JSON.stringify(updatedContent, null, 2));
    setCheckedSources([]);
  }

  async function refreshCurrent() {
    if (!record) return;
    await onRefresh();
    const current = await responseJson(await fetch(`/api/admin/topic/${record.topicId}`, { cache: "no-store" }));
    onDetail(current);
  }

  async function saveTask(status: Status) {
    if (!record || !detail) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/admin/task/${record.topicId}`, {
        method: "PUT", headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: version, status, assignee: assignment, notes, eventNote: status === "in_review" ? "Review assigned or started." : "Review returned to the queue." }),
      });
      const result = await responseJson(response);
      onDetail({ ...detail, task: { ...detail.task, ...result.task } });
      await refreshCurrent();
      setSuccess("Assignment and status saved.");
    } catch (reason) { onError(reason instanceof Error ? reason.message : "Could not save assignment."); }
    finally { setBusy(false); }
  }

  async function saveDraft() {
    if (!record || !detail || !effectiveContent) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/admin/draft/${record.topicId}`, {
        method: "PUT", headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: version, content: effectiveContent }),
      });
      const result = await responseJson(response);
      const updated = { ...detail, task: { ...detail.task, ...result.task, draftContent: effectiveContent } };
      onDetail(updated); setRawJson(JSON.stringify(effectiveContent, null, 2));
      await refreshCurrent(); setSuccess("Working copy saved for the team.");
    } catch (reason) { onError(reason instanceof Error ? reason.message : "Could not save this page."); }
    finally { setBusy(false); }
  }

  async function verifyAndPublish() {
    if (!record || !detail || !effectiveContent) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/admin/verify/${record.topicId}`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: version, content: effectiveContent, notes, qualification, checkedSources, checkedPage: pageChecked }),
      });
      const result = await responseJson(response);
      onDetail({ ...detail, task: { ...detail.task, ...result.task, draftContent: effectiveContent, hasPublishedContent: true } });
      await refreshCurrent(); setSuccess("Verified and published. The updated page is now live.");
    } catch (reason) { onError(reason instanceof Error ? reason.message : "Could not publish this page."); }
    finally { setBusy(false); }
  }

  async function restoreRevision(historyId: number) {
    if (!record || !detail) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/admin/restore/${record.topicId}`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: version, historyId }),
      });
      const result = await responseJson(response);
      setTitle(String(result.content.title ?? "")); setOverview(String(result.content.overview ?? "")); setRawJson(JSON.stringify(result.content, null, 2));
      onDetail({ ...detail, task: { ...detail.task, ...result.task, draftContent: result.content } });
      await refreshCurrent(); setSuccess("Revision restored as a working copy.");
    } catch (reason) { onError(reason instanceof Error ? reason.message : "Could not restore that revision."); }
    finally { setBusy(false); }
  }

  function setError(message: string) { onError(message); }

  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">EDIT AND REVIEW</p><h2>Page editor</h2><p>Make a working copy, check its sources, and publish when the review is complete.</p></div></div>
      <label className="admin-topic-picker"><span>Choose a library page</span><select value={record?.topicId ?? selectedFromUrl()} onChange={(event) => { onSelect(event.target.value); window.history.replaceState(null, "", `${ADMIN_ROOT}/edit?topic_id=${event.target.value}`); }}><option value="">Select a page…</option>{records.map((item) => <option key={item.topicId} value={item.topicId}>{item.title} · {item.topicId}</option>)}</select></label>
      {loading && <div className="admin-loading">Loading page content…</div>}
      {!loading && !record && <div className="admin-card admin-empty-editor"><h3>Choose a page to begin</h3><p>Search the library list above, or start with the next entry awaiting review.</p><a href={`${ADMIN_ROOT}/review`}>Open review center →</a></div>}
      {!loading && record && detail && effectiveContent && (
        <>
          <div className="admin-editor-topline"><div><p className="admin-table-subtitle">{record.topicId} · {record.domain}</p><h3>{title || record.title}</h3><StatusBadge status={detail.task.version === 0 ? record.initialStatus : detail.task.status} /></div><a className="admin-quiet-link" href={`/en/ontology/${record.topicId}`} target="_blank" rel="noreferrer">Open public page ↗</a></div>
          <div className="admin-editor-grid">
            <section className="admin-card admin-editor-main">
              <div className="admin-card-heading"><div><p className="eyebrow">PAGE CONTENT</p><h3>Update the entry</h3></div><span>Version {detail.task.version}</span></div>
              <label className="admin-field"><span>Page title</span><input value={title} maxLength={180} onChange={(event) => setTitle(event.target.value)} /></label>
              <label className="admin-field"><span>Overview</span><textarea rows={13} value={overview} onChange={(event) => setOverview(event.target.value)} /></label>
              <details className="admin-advanced-editor"><summary>Edit all structured content</summary><p>Use this area for source details, sections, terms, and other page fields. The title and overview above are applied when you save.</p><textarea aria-label="Complete page content in JSON format" spellCheck={false} rows={18} value={rawJson} onChange={(event) => { setRawJson(event.target.value); setCheckedSources([]); }} /></details>
              {!parsedJson && <p className="admin-inline-error" role="alert">The structured content must be valid JSON before it can be saved.</p>}
              <div className="admin-save-row"><button className="button button--quiet" type="button" disabled={busy || !effectiveContent} onClick={saveDraft}>{busy ? "Saving…" : "Save working copy"}</button>{success && <span className="admin-save-success" role="status">{success}</span>}</div>
            </section>

            <aside className="admin-editor-side">
              <section className="admin-card">
                <div className="admin-card-heading"><div><p className="eyebrow">TEAM</p><h3>Assignment</h3></div></div>
                <label className="admin-field"><span>Assigned editor</span><input type="email" value={assignment} placeholder="editor@example.com" onChange={(event) => setAssignment(event.target.value)} /></label>
                <label className="admin-field"><span>Review notes</span><textarea rows={4} value={notes} placeholder="What should the next editor check? What did you confirm?" onChange={(event) => setNotes(event.target.value)} /></label>
                <button className="button button--quiet admin-full-button" type="button" disabled={busy} onClick={() => saveTask("in_review")}>Save assignment</button>
              </section>
              <section className="admin-card admin-source-checklist">
                <div className="admin-card-heading"><div><p className="eyebrow">SOURCES</p><h3>{sources.length} listed</h3></div></div>
                {sources.length ? <ul>{sources.map((source, index) => {
                  const complete = citationIsComplete(source);
                  return <li key={`${String(source.title)}-${index}`}>
                    <div className="admin-source-entry">
                      <strong>{String(source.title ?? "Untitled source")}</strong>
                      <label className="admin-field"><span>Source URL</span><input type="url" value={String(source.url ?? "")} placeholder="https://…" onChange={(event) => updateSourceField(index, "url", event.target.value)} /></label>
                      <div className="admin-source-entry__row">
                        <label className="admin-field"><span>Source type</span><input value={String(source.source_type ?? "")} placeholder="Primary text, academic study…" onChange={(event) => updateSourceField(index, "source_type", event.target.value)} /></label>
                        <label className="admin-field"><span>Page or section</span><input value={String(source.locator ?? "")} placeholder="Chapter, sūtra, page…" onChange={(event) => updateSourceField(index, "locator", event.target.value)} /></label>
                      </div>
                      <label className="admin-source-check"><input type="checkbox" checked={checkedSources[index] ?? false} disabled={!complete} onChange={(event) => setCheckedSources((current) => { const next = [...current]; next[index] = event.target.checked; return next; })} /><span>I checked this source{!complete && <small> Add a secure link, source type, and precise page or section.</small>}</span></label>
                    </div>
                  </li>;
                })}</ul> : <p className="admin-muted">Add at least one named citation in the structured content before publishing.</p>}
                <label className="admin-check-confirm"><input type="checkbox" checked={pageChecked} onChange={(event) => setPageChecked(event.target.checked)} /><span>I checked this page against the citations above.</span></label>
                <label className="admin-field"><span>Reviewer role or relevant experience</span><input value={qualification} maxLength={180} placeholder="For example: Jain studies researcher" onChange={(event) => setQualification(event.target.value)} /></label>
                <button className="button button--primary admin-full-button" type="button" disabled={busy || !effectiveContent || !sources.length || sources.some((source) => !citationIsComplete(source)) || !pageChecked || checkedSources.length !== sources.length || checkedSources.some((item) => !item) || notes.trim().length < 12 || qualification.trim().length < 4} onClick={verifyAndPublish}>{busy ? "Publishing…" : "Verify and publish"}</button>
                <p className="admin-help-text">Publishing updates the public entry immediately. A short review note is required.</p>
              </section>
              <section className="admin-card admin-history">
                <div className="admin-card-heading"><div><p className="eyebrow">PAGE HISTORY</p><h3>Recent activity</h3></div></div>
                {detail.history.length ? <ol>{detail.history.map((event) => <li key={event.id}><div><strong>{event.action.replaceAll("_", " ")}</strong><small>{event.actor} · {dateLabel(event.createdAt)}</small>{event.note && <p>{event.note}</p>}</div>{event.hasSnapshot === 1 && <button type="button" disabled={busy} onClick={() => restoreRevision(event.id)}>Restore</button>}</li>)}</ol> : <p className="admin-muted">Saved changes and review decisions will appear here.</p>}
              </section>
            </aside>
          </div>
        </>
      )}
    </>
  );
}

function selectedFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("topic_id") ?? "";
}
