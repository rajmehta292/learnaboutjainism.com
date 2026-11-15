import {
  json,
  requireReader,
  requestHasSameOrigin,
  topicIdFrom,
} from "../../../_shared/reader-auth.js";

export async function onRequestGet(context) {
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const saved = await auth.db.prepare(
    "SELECT 1 AS saved FROM reader_saved_topics WHERE user_id = ? AND topic_id = ?"
  ).bind(auth.user.id, topicId).first();
  return json({ saved: Boolean(saved) });
}

export async function onRequestPost(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  await auth.db.prepare(
    "INSERT OR IGNORE INTO reader_saved_topics (user_id, topic_id, saved_at) VALUES (?, ?, ?)"
  ).bind(auth.user.id, topicId, new Date().toISOString()).run();
  return json({ success: true, saved: true });
}

export async function onRequestDelete(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  await auth.db.prepare("DELETE FROM reader_saved_topics WHERE user_id = ? AND topic_id = ?")
    .bind(auth.user.id, topicId).run();
  return json({ success: true, saved: false });
}
