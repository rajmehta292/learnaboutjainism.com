import { editorContext, json, readBody, topicIdFrom, writeTask } from "../../../_shared/admin.js";

export async function onRequestPost(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  const parsed = await readBody(context.request);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const historyId = Number(parsed.value.historyId);
  if (!Number.isSafeInteger(historyId) || historyId < 1) return json({ error: "Choose a saved revision." }, 400);
  const revision = await auth.db.prepare("SELECT content_snapshot FROM review_history WHERE id = ? AND topic_id = ?")
    .bind(historyId, topicId).first();
  if (!revision?.content_snapshot) return json({ error: "This activity does not contain a restorable page revision." }, 404);
  const result = await writeTask(auth.db, topicId, auth.actor, parsed.value.expectedVersion, {
    status: "in_review", draftContent: revision.content_snapshot,
  }, { action: "revision_restored", note: `Restored revision ${historyId} as a working copy.`, contentSnapshot: revision.content_snapshot });
  if (result.response) return result.response;
  return json({ task: { topicId, status: result.task.status, version: result.version, updatedAt: result.task.updated_at, updatedBy: auth.actor }, content: JSON.parse(revision.content_snapshot) });
}
