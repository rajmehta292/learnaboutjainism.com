import { editorContext, json } from "../../_shared/admin.js";

export async function onRequestGet(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const compact = new URL(context.request.url).searchParams.get("summary") === "1";
  const tasksQuery = compact ? Promise.resolve({ results: [] }) : auth.db.prepare(`
    SELECT topic_id AS topicId, status, assignee, notes, version,
           CASE WHEN draft_content IS NULL THEN 0 ELSE 1 END AS hasDraft,
           updated_at AS updatedAt, updated_by AS updatedBy
    FROM review_tasks ORDER BY updated_at DESC
  `).all();
  const [{ results }, feedbackStatuses, feedbackRecent] = await Promise.all([tasksQuery, auth.db.prepare(`
    SELECT status, COUNT(*) AS count FROM reader_feedback GROUP BY status
  `).all(), auth.db.prepare(`
    SELECT id, feedback_type AS type, page_url AS pageUrl, feedback AS body,
           status, github_sync_state AS githubSyncState, created_at AS createdAt
    FROM reader_feedback ORDER BY created_at DESC LIMIT 5
  `).all()]);
  const counts = Object.fromEntries((feedbackStatuses.results ?? []).map((row) => [row.status, Number(row.count)]));
  const drafts = (results ?? []).filter((task) => task.hasDraft === 1).length;
  return json({
    user: auth.actor,
    authMethod: auth.authMethod,
    tasks: compact ? undefined : (results ?? []),
    summary: {
      savedDrafts: drafts,
      feedbackTotal: Object.values(counts).reduce((sum, count) => sum + count, 0),
      feedbackNew: counts.new ?? 0,
      feedbackActive: (counts.new ?? 0) + (counts.triaged ?? 0) + (counts.in_progress ?? 0),
      feedbackStatuses: counts,
      recentFeedback: feedbackRecent.results ?? [],
    },
  });
}
