import {
  json,
  readJsonBody,
  requireReader,
  requestHasSameOrigin,
  topicIdFrom,
} from "../../../_shared/reader-auth.js";

export async function onRequestGet(context) {
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const note = await auth.db.prepare(
    "SELECT body, updated_at AS updatedAt FROM reader_notes WHERE user_id = ? AND topic_id = ?"
  ).bind(auth.user.id, topicId).first();
  return json({ note: note || { body: "", updatedAt: null } });
}

export async function onRequestPut(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const parsed = await readJsonBody(context.request, 82_000);
  if (parsed.error) return json({ error: parsed.error }, 400);
  if (typeof parsed.value.body !== "string" || parsed.value.body.length > 20_000) {
    return json({ error: "Notes must be 20,000 characters or fewer." }, 400);
  }
  const body = parsed.value.body;
  if (!body.trim()) {
    await auth.db.prepare("DELETE FROM reader_notes WHERE user_id = ? AND topic_id = ?")
      .bind(auth.user.id, topicId).run();
    return json({ success: true, deleted: true });
  }
  const now = new Date().toISOString();
  await auth.db.prepare(
    "INSERT INTO reader_notes (user_id, topic_id, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?) " +
    "ON CONFLICT(user_id, topic_id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at"
  ).bind(auth.user.id, topicId, body, now, now).run();
  return json({ success: true, updatedAt: now });
}
