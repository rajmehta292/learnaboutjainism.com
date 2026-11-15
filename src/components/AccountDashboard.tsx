"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useSiteLocale } from "@/i18n/LocaleProvider";
import { getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

type User = { id: string; email: string; name: string; role: "reader" | "librarian" };
type Progress = { topicId: string; completed: number; lastAccessed: string };
type SavedTopic = { topicId: string; savedAt: string };
type NotePreview = { topicId: string; excerpt: string; updatedAt: string };
type DashboardData = { user: User; progress: Progress[]; saved: SavedTopic[]; notes: NotePreview[] };
type TopicEntry = { topicId: string; title: string };

export default function AccountDashboard() {
  const locale = useSiteLocale();
  const copy = getMessages(locale).Account;
  const [data, setData] = useState<DashboardData | null>(null);
  const [titleById, setTitleById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await sessionResponse.json();
        if (!sessionResponse.ok) throw new Error(session.error || copy.genericError);
        if (!session.user) {
          if (active) setData(null);
          return;
        }
        const [dashboardResponse, topicResponse] = await Promise.all([
          fetch("/api/account/dashboard", { cache: "no-store" }),
          fetch("/content-review-index.json", { cache: "force-cache" }),
        ]);
        const dashboard = await dashboardResponse.json();
        if (!dashboardResponse.ok) throw new Error(dashboard.error || copy.genericError);
        if (!active) return;
        setData(dashboard);
        if (topicResponse.ok) {
          const manifest = await topicResponse.json();
          const entries = Array.isArray(manifest.topics) ? manifest.topics as TopicEntry[] : [];
          setTitleById(Object.fromEntries(entries.map((item) => [item.topicId, item.title])));
        }
      } catch (reason) {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : copy.genericError);
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [copy, locale]);

  const completedCount = useMemo(() => data?.progress.filter((item) => item.completed === 1).length ?? 0, [data]);
  const signInHref = "/" + locale + "/sign-in?return_to=" + encodeURIComponent("/" + locale + "/account");
  const articleHref = (topicId: string) => "/en/ontology/" + encodeURIComponent(topicId);
  const topicTitle = (topicId: string) => titleById[topicId] || topicId;
  const visibleItems = <T,>(key: string, items: T[]) => expanded[key] ? items : items.slice(0, 12);
  const toggleExpanded = (key: string) => setExpanded((current) => ({ ...current, [key]: !current[key] }));
  const dateLabel = (date: string) => {
    const value = new Date(date);
    return Number.isNaN(value.getTime()) ? "" : new Intl.DateTimeFormat(locale as SiteLocale, { dateStyle: "medium" }).format(value);
  };

  async function signOut() {
    setWorking(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setData(null);
    setWorking(false);
  }

  async function deleteAccount() {
    if (!window.confirm(copy.deleteConfirm)) return;
    setWorking(true);
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || copy.deleteError);
      setData(null);
    } catch {
      setError(copy.deleteError);
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="account-page" id="main-content">
      <div className="account-wrap">
        <header className="account-heading">
          <div>
            <p className="eyebrow">{copy.metadataTitle}</p>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>
          {data?.user && (
            <div className="account-user">
              <span aria-hidden="true">{(data.user.name || data.user.email).slice(0, 1).toUpperCase()}</span>
              <div><strong>{data.user.name || data.user.email}</strong><small>{data.user.email}</small></div>
            </div>
          )}
        </header>

        {loading ? <p className="account-empty" role="status">{copy.loading}</p> : null}
        {error ? <p className="account-alert" role="alert">{error}</p> : null}
        {!loading && !data ? (
          <section className="account-signin-card account-signin-card--inline">
            <p>{copy.signedOut}</p>
            <a className="button button--primary" href={signInHref}>{copy.googleButton}</a>
            <p className="account-privacy">{copy.googlePrivacy}</p>
          </section>
        ) : null}

        {data ? (
          <>
            <p className="account-subtitle">{copy.dashboardIntro}</p>
            <div className="account-stats">
              <article><span>{copy.totalRead}</span><strong>{data.progress.length}</strong></article>
              <article><span>{copy.completed}</span><strong>{completedCount}</strong></article>
              <article><span>{copy.savedCount}</span><strong>{data.saved.length}</strong></article>
              <article><span>{copy.noteCount}</span><strong>{data.notes.length}</strong></article>
            </div>

            <div className="account-grid">
              <section className="account-panel">
                <h2>{copy.continueTitle}</h2>
                {data.progress.length ? <ul className="account-list">{visibleItems("progress", data.progress).map((item) => (
                  <li key={item.topicId}>
                    <div><Link href={articleHref(item.topicId)}>{topicTitle(item.topicId)}</Link><small>{dateLabel(item.lastAccessed)}</small></div>
                    {item.completed === 1 && <span className="account-tag">{copy.completed}</span>}
                  </li>
                ))}</ul> : <p className="account-empty">{copy.noProgress}</p>}
                {data.progress.length > 12 && <button className="account-expand" type="button" onClick={() => toggleExpanded("progress")}>{expanded.progress ? copy.showRecent : copy.showAll}</button>}
              </section>
              <section className="account-panel">
                <h2>{copy.savedTitle}</h2>
                {data.saved.length ? <ul className="account-list">{visibleItems("saved", data.saved).map((item) => (
                  <li key={item.topicId}><div><Link href={articleHref(item.topicId)}>{topicTitle(item.topicId)}</Link><small>{dateLabel(item.savedAt)}</small></div></li>
                ))}</ul> : <p className="account-empty">{copy.noSaved}</p>}
                {data.saved.length > 12 && <button className="account-expand" type="button" onClick={() => toggleExpanded("saved")}>{expanded.saved ? copy.showRecent : copy.showAll}</button>}
              </section>
              <section className="account-panel">
                <h2>{copy.completedTitle}</h2>
                {data.progress.some((item) => item.completed === 1)
                  ? <ul className="account-list">{visibleItems("completed", data.progress.filter((item) => item.completed === 1)).map((item) => (
                    <li key={item.topicId}><div><Link href={articleHref(item.topicId)}>{topicTitle(item.topicId)}</Link><small>{dateLabel(item.lastAccessed)}</small></div></li>
                  ))}</ul>
                  : <p className="account-empty">{copy.noCompleted}</p>}
                {data.progress.filter((item) => item.completed === 1).length > 12 && <button className="account-expand" type="button" onClick={() => toggleExpanded("completed")}>{expanded.completed ? copy.showRecent : copy.showAll}</button>}
              </section>
              <section className="account-panel">
                <h2>{copy.notesTitle}</h2>
                {data.notes.length ? <ul className="account-list account-note-list">{visibleItems("notes", data.notes).map((item) => (
                  <li key={item.topicId}>
                    <div><Link href={articleHref(item.topicId)}>{topicTitle(item.topicId)}</Link><p>{item.excerpt}</p><small>{dateLabel(item.updatedAt)}</small></div>
                  </li>
                ))}</ul> : <p className="account-empty">{copy.noNotes}</p>}
                {data.notes.length > 12 && <button className="account-expand" type="button" onClick={() => toggleExpanded("notes")}>{expanded.notes ? copy.showRecent : copy.showAll}</button>}
              </section>
            </div>
            <div className="account-actions">
              <button className="button button--quiet" type="button" disabled={working} onClick={() => void signOut()}>{copy.signOut}</button>
              <button className="account-delete" type="button" disabled={working} onClick={() => void deleteAccount()}>{copy.deleteAccount}</button>
            </div>
          </>
        ) : null}
        <p className="account-librarian-hint">{copy.librarianHint}</p>
      </div>
    </main>
  );
}
