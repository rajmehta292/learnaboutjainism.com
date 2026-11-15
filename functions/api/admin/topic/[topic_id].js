import { editorContext, json, topicIdFrom } from "../../../_shared/admin.js";

export async function onRequestGet(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  const task = await auth.db.prepare("SELECT * FROM review_tasks WHERE topic_id = ?").bind(topicId).first();
  const { results } = await auth.db.prepare(`
    SELECT id, actor, action, status, note, version, created_at AS createdAt,
           CASE WHEN content_snapshot IS NULL THEN 0 ELSE 1 END AS hasSnapshot
    FROM review_history WHERE topic_id = ? ORDER BY id DESC LIMIT 25
  `).bind(topicId).all();
  return json({
    task: task ? {
      topicId: task.topic_id,
      status: task.status,
      assignee: task.assignee,
      notes: task.notes,
      draftContent: task.draft_content ? JSON.parse(task.draft_content) : null,
      hasPublishedContent: Boolean(task.published_content),
      version: task.version,
      updatedAt: task.updated_at,
      updatedBy: task.updated_by,
    } : { topicId, status: "needs_review", assignee: "", notes: "", draftContent: null, hasPublishedContent: false, version: 0 },
    history: results ?? [],
  });
}
