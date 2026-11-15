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
  const progress = await auth.db.prepare(
    "SELECT completed, last_accessed AS lastAccessed FROM reader_progress WHERE user_id = ? AND topic_id = ?"
  ).bind(auth.user.id, topicId).first();
  return json(progress || { completed: 0, lastAccessed: null });
}

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
  return json({ success: true });
}

export async function onRequestPut(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "This topic could not be found." }, 404);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const parsed = await readJsonBody(context.request, 1000);
  if (parsed.error) return json({ error: parsed.error }, 400);
  if (typeof parsed.value.completed !== "boolean") return json({ error: "Choose whether this topic is complete." }, 400);
  const now = new Date().toISOString();
  await auth.db.prepare(
    "INSERT INTO reader_progress (user_id, topic_id, completed, last_accessed) VALUES (?, ?, ?, ?) " +
    "ON CONFLICT(user_id, topic_id) DO UPDATE SET completed = excluded.completed, last_accessed = excluded.last_accessed"
  ).bind(auth.user.id, topicId, parsed.value.completed ? 1 : 0, now).run();
  return json({ success: true, completed: parsed.value.completed, lastAccessed: now });
}
