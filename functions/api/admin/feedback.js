import { editorContext, json } from "../../_shared/admin.js";
import { feedbackJson } from "../../_shared/feedback.js";

export async function onRequestGet(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const status = url.searchParams.get("status") ?? "all";
  const allowed = new Set(["all", "new", "triaged", "in_progress", "resolved", "dismissed"]);
  if (!allowed.has(status)) return json({ error: "Choose a valid feedback status." }, 400);
  const rows = await auth.db.prepare(`
    SELECT * FROM reader_feedback
    WHERE (? = 'all' OR status = ?)
    ORDER BY CASE status
      WHEN 'new' THEN 0 WHEN 'triaged' THEN 1 WHEN 'in_progress' THEN 2
      WHEN 'resolved' THEN 3 ELSE 4 END, created_at DESC
    LIMIT 250
  `).bind(status, status).all();
  const counts = await auth.db.prepare("SELECT status, COUNT(*) AS count FROM reader_feedback GROUP BY status").all();
  return json({
    items: (rows.results ?? []).map(feedbackJson),
    counts: Object.fromEntries((counts.results ?? []).map((row) => [row.status, Number(row.count)])),
    user: auth.actor,
  });
}
