import { editorContext, json, readBody, topicIdFrom, writeTask } from "../../../_shared/admin.js";

export async function onRequestPut(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  const parsed = await readBody(context.request);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const body = parsed.value;
  if (!['needs_review', 'in_review'].includes(body.status)) return json({ error: "Choose Needs review or In review." }, 400);
  const assignee = typeof body.assignee === "string" ? body.assignee.trim().slice(0, 254) : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 5000) : "";
  const result = await writeTask(auth.db, topicId, auth.actor, body.expectedVersion, { status: body.status, assignee, notes }, {
    action: "task_updated", note: typeof body.eventNote === "string" ? body.eventNote.trim().slice(0, 500) : "Assignment or review status updated.",
  });
  if (result.response) return result.response;
  return json({ task: { topicId, status: result.task.status, assignee: result.task.assignee, notes: result.task.notes, version: result.version, updatedAt: result.task.updated_at, updatedBy: auth.actor } });
}
