import { editorContext, json, readBody, topicIdFrom, writeTask } from "../../../_shared/admin.js";

export async function onRequestPut(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  const parsed = await readBody(context.request);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const body = parsed.value;
  if (!body.content || typeof body.content !== "object" || Array.isArray(body.content) || typeof body.content.title !== "string" || !body.content.title.trim()) {
    return json({ error: "Add a page title and valid page content before saving." }, 400);
  }
  const current = await auth.db.prepare("SELECT status FROM review_tasks WHERE topic_id = ?").bind(topicId).first();
  const status = current?.status === "verified" ? "in_review" : (current?.status ?? "in_review");
  const snapshot = JSON.stringify(body.content);
  const result = await writeTask(auth.db, topicId, auth.actor, body.expectedVersion, { status, draftContent: snapshot }, {
    action: "draft_saved", note: "Working copy saved.", contentSnapshot: snapshot,
  });
  if (result.response) return result.response;
  return json({ task: { topicId, status: result.task.status, version: result.version, updatedAt: result.task.updated_at, updatedBy: auth.actor } });
}
