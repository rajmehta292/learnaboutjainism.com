import { json, requireReader } from "../../_shared/reader-auth.js";

export async function onRequestGet(context) {
  try {
    const auth = await requireReader(context);
    if (auth.response) return auth.response;
    const userId = auth.user.id;
    const [progress, saved, notes] = await Promise.all([
      auth.db.prepare(
        "SELECT topic_id AS topicId, completed, last_accessed AS lastAccessed " +
        "FROM reader_progress WHERE user_id = ? ORDER BY last_accessed DESC"
      ).bind(userId).all(),
      auth.db.prepare(
        "SELECT topic_id AS topicId, saved_at AS savedAt " +
        "FROM reader_saved_topics WHERE user_id = ? ORDER BY saved_at DESC"
      ).bind(userId).all(),
      auth.db.prepare(
        "SELECT topic_id AS topicId, substr(body, 1, 240) AS excerpt, updated_at AS updatedAt " +
        "FROM reader_notes WHERE user_id = ? ORDER BY updated_at DESC"
      ).bind(userId).all(),
    ]);
    return json({
      user: auth.user,
      progress: progress.results || [],
      saved: saved.results || [],
      notes: notes.results || [],
    });
  } catch {
    return json({ error: "Your reading account could not be loaded right now." }, 503);
  }
}
