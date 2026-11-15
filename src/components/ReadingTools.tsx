"use client";

import { useEffect, useState } from "react";
import { useSiteLocale } from "@/i18n/LocaleProvider";
import { getMessages } from "@/i18n/messages";

type User = { email: string };

export default function ReadingTools({ topicId }: { topicId: string }) {
  const locale = useSiteLocale();
  const copy = getMessages(locale).Account;
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/account/topic/" + topicId, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "opened" }),
    })
      .then(async (response) => {
        const value = await response.json();
        if (!active || !response.ok) return;
        setUser(value.user || null);
        setCompleted(Boolean(value.completed));
        setSaved(Boolean(value.saved));
        setNote(typeof value.note?.body === "string" ? value.note.body : "");
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [topicId]);

  async function updateProgress(next: boolean) {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/account/progress/" + topicId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ completed: next }),
      });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || copy.genericError);
      setCompleted(next);
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : copy.genericError);
    } finally { setSaving(false); }
  }

  async function updateSaved(next: boolean) {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/account/reading-list/" + topicId, { method: next ? "POST" : "DELETE" });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || copy.genericError);
      setSaved(next);
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : copy.genericError);
    } finally { setSaving(false); }
  }

  async function saveNote() {
    setSaving(true);
    setStatus(copy.saving);
    try {
      const response = await fetch("/api/account/notes/" + topicId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: note }),
      });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || copy.genericError);
      setStatus(note.trim() ? copy.noteSaved : copy.noteDeleted);
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : copy.genericError);
    } finally { setSaving(false); }
  }

  if (loading) return <section className="reader-tools reader-tools--loading" aria-label={copy.title} aria-busy="true" />;
  if (!user) {
    const returnTo = "/en/ontology/" + topicId;
    return (
      <section className="reader-tools reader-tools--signed-out" aria-label={copy.title}>
        <div><strong>{copy.title}</strong><p>{copy.signedOut}</p></div>
        <a className="button button--outline" href={"/" + locale + "/sign-in?return_to=" + encodeURIComponent(returnTo)}>{copy.googleButton}</a>
      </section>
    );
  }

  return (
    <section className="reader-tools" aria-label={copy.title}>
      <div className="reader-tools__heading">
        <div><p className="eyebrow">{copy.title}</p><span>{user.email}</span></div>
        <div className="reader-tools__actions">
          <button className="button button--quiet" type="button" disabled={saving} onClick={() => void updateSaved(!saved)}>{saved ? copy.removeSaved : copy.saveForLater}</button>
          <button className="button button--primary" type="button" disabled={saving} onClick={() => void updateProgress(!completed)}>{completed ? copy.markIncomplete : copy.markComplete}</button>
        </div>
      </div>
      <label className="reader-tools__note-label" htmlFor="topic-note">{copy.noteLabel}</label>
      <textarea id="topic-note" value={note} maxLength={20_000} placeholder={copy.notePlaceholder} onChange={(event) => setNote(event.target.value)} />
      <div className="reader-tools__note-footer">
        <span role="status" aria-live="polite">{status}</span>
        <button className="button button--outline" type="button" disabled={saving} onClick={() => void saveNote()}>{saving ? copy.saving : copy.saveNote}</button>
      </div>
    </section>
  );
}
