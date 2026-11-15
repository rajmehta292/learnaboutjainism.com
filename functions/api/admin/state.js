import { editorContext, json } from "../../_shared/admin.js";

export async function onRequestGet(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const { results } = await auth.db.prepare(`
    SELECT topic_id AS topicId, status, assignee, notes, version, updated_at AS updatedAt, updated_by AS updatedBy
    FROM review_tasks ORDER BY updated_at DESC
  `).all();
  return json({ user: auth.actor, tasks: results ?? [] });
}
