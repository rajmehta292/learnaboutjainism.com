import { json, topicIdFrom } from "../../_shared/admin.js";

export async function onRequestGet(context) {
  const topicId = topicIdFrom(context);
  if (!topicId) return json({ error: "Topic not found." }, 404);
  if (!context.env.LIBRARY_DB) return json({ publishedContent: null });
  const row = await context.env.LIBRARY_DB
    .prepare("SELECT published_content FROM review_tasks WHERE topic_id = ?")
    .bind(topicId)
    .first();
  if (!row?.published_content) return json({ publishedContent: null });
  try {
    return json({ publishedContent: JSON.parse(row.published_content) });
  } catch {
    return json({ error: "Published content could not be read." }, 500);
  }
}
