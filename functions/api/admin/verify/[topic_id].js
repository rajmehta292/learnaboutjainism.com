import { editorContext, json, readBody, topicIdFrom, writeTask } from "../../../_shared/admin.js";

export async function onRequestPost(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  const parsed = await readBody(context.request);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const body = parsed.value;
  const content = body.content;
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 5000) : "";
  const sources = Array.isArray(content?.editorial_review?.sources) && content.editorial_review.sources.length
    ? content.editorial_review.sources
    : content?.primary_sources;
  const qualification = typeof body.qualification === "string" ? body.qualification.trim().slice(0, 180) : "";
  if (!content || typeof content !== "object" || Array.isArray(content) || typeof content.title !== "string" || !content.title.trim()) {
    return json({ error: "Add a page title and valid page content before verification." }, 400);
  }
  if (!Array.isArray(sources) || sources.length === 0 || sources.some((source) => {
    if (!source || typeof source.title !== "string" || !source.title.trim() || typeof source.source_type !== "string" || !source.source_type.trim() || typeof source.locator !== "string" || !source.locator.trim()) return true;
    try { return new URL(source.url).protocol !== "https:"; } catch { return true; }
  })) {
    return json({ error: "Each citation needs a secure source link, source type, and page or section." }, 400);
  }
  if (!Array.isArray(body.checkedSources) || body.checkedSources.length !== sources.length || body.checkedSources.some((checked) => checked !== true)) {
    return json({ error: "Check each listed source before verifying this page." }, 400);
  }
  if (body.checkedPage !== true) return json({ error: "Confirm that you reviewed the page before publishing." }, 400);
  if (notes.length < 12) return json({ error: "Add a short note about what you checked before publishing." }, 400);
  if (qualification.length < 4) return json({ error: "Add your role or relevant experience before publishing." }, 400);

  const reviewedOn = new Date().toISOString().slice(0, 10);
  const publishedContent = {
    ...content,
    editorial_review: {
      ...(content.editorial_review && typeof content.editorial_review === "object" && !Array.isArray(content.editorial_review) ? content.editorial_review : {}),
      status: "reviewed",
      reviewed_by: auth.actor,
      reviewer_qualification: qualification,
      reviewed_on: reviewedOn,
      sources,
    },
  };
  const snapshot = JSON.stringify(publishedContent);
  const result = await writeTask(auth.db, topicId, auth.actor, body.expectedVersion, {
    status: "verified",
    assignee: auth.actor,
    notes,
    draftContent: snapshot,
    publishedContent: snapshot,
  }, { action: "verified_and_published", note: notes, contentSnapshot: snapshot });
  if (result.response) return result.response;
  return json({ task: { topicId, status: result.task.status, version: result.version, updatedAt: result.task.updated_at, updatedBy: auth.actor } });
}
