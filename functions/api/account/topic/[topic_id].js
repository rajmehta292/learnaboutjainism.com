import {
  json,
  readJsonBody,
  requireReader,
  requestHasSameOrigin,
  topicIdFrom,
} from "../../../_shared/reader-auth.js";

export async function onRequestPost(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const parsed = await readJsonBody(context.request, 1000);
  if (parsed.error) return json({ error: parsed.error }, 400);
  if (parsed.value.action !== "opened") return json({ error: "This reading update is not supported." }, 400);

  const now = new Date().toISOString();
  await auth.db.prepare(
    "INSERT INTO reader_progress (user_id, topic_id, completed, last_accessed) VALUES (?, ?, 0, ?) " +
    "ON CONFLICT(user_id, topic_id) DO UPDATE SET last_accessed = excluded.last_accessed"
  ).bind(auth.user.id, topicId, now).run();
  const [progress, saved, note] = await Promise.all([
    auth.db.prepare(
      "SELECT completed, last_accessed AS lastAccessed FROM reader_progress WHERE user_id = ? AND topic_id = ?"
    ).bind(auth.user.id, topicId).first(),
    auth.db.prepare(
      "SELECT 1 AS saved FROM reader_saved_topics WHERE user_id = ? AND topic_id = ?"
    ).bind(auth.user.id, topicId).first(),
    auth.db.prepare(
      "SELECT body, updated_at AS updatedAt FROM reader_notes WHERE user_id = ? AND topic_id = ?"
    ).bind(auth.user.id, topicId).first(),
  ]);
  return json({
    user: { email: auth.user.email },
    completed: progress?.completed === 1,
    saved: Boolean(saved),
    note: note || { body: "", updatedAt: null },
  });
}
