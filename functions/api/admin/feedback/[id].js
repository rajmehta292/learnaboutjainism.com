import { editorContext, json, readBody } from "../../../_shared/admin.js";
import { feedbackJson } from "../../../_shared/feedback.js";

const statuses = new Set(["new", "triaged", "in_progress", "resolved", "dismissed"]);

function feedbackId(context) {
  const id = String(context.params?.id ?? "");
  return /^[0-9a-f-]{36}$/i.test(id) ? id : "";
}

export async function onRequestGet(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const id = feedbackId(context);
  if (!id) return json({ error: "Feedback entry not found." }, 404);
  const item = await auth.db.prepare("SELECT * FROM reader_feedback WHERE id = ?").bind(id).first();
  if (!item) return json({ error: "Feedback entry not found." }, 404);
  const history = await auth.db.prepare(`
    SELECT id, actor, action, status, note, version, created_at AS createdAt
    FROM reader_feedback_history WHERE feedback_id = ? ORDER BY id DESC LIMIT 30
  `).bind(id).all();
  return json({ item: feedbackJson(item), history: history.results ?? [] });
}

export async function onRequestPatch(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const id = feedbackId(context);
  if (!id) return json({ error: "Feedback entry not found." }, 404);
  const parsed = await readBody(context.request);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const body = parsed.value;
  if (!Number.isSafeInteger(body.expectedVersion) || body.expectedVersion < 0) return json({ error: "Reload this entry before saving." }, 400);
  if (!statuses.has(body.status)) return json({ error: "Choose a valid status." }, 400);
  const assignee = typeof body.assignee === "string" ? body.assignee.trim().slice(0, 254) : "";
  const staffNotes = typeof body.staffNotes === "string" ? body.staffNotes.trim().slice(0, 5000) : "";
  const eventNote = typeof body.eventNote === "string" ? body.eventNote.trim().slice(0, 500) : "Feedback triage updated.";
  const updatedAt = new Date().toISOString();
  const result = await auth.db.prepare(`
    UPDATE reader_feedback SET status = ?, assignee = ?, staff_notes = ?,
      version = version + 1, updated_at = ?, updated_by = ?
    WHERE id = ? AND version = ?
  `).bind(body.status, assignee, staffNotes, updatedAt, auth.actor, id, body.expectedVersion).run();
  if (result.meta?.changes !== 1) return json({ error: "Another librarian updated this report. Reload it before saving again." }, 409);

  const version = body.expectedVersion + 1;
  await auth.db.prepare(`
    INSERT INTO reader_feedback_history (feedback_id, actor, action, status, note, version, created_at)
    VALUES (?, ?, 'triage_updated', ?, ?, ?, ?)
  `).bind(id, auth.actor, body.status, eventNote || "Feedback triage updated.", version, updatedAt).run();
  const updated = await auth.db.prepare("SELECT * FROM reader_feedback WHERE id = ?").bind(id).first();
  return json({ item: feedbackJson(updated) });
}
