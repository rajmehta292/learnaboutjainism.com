import {
  clearSessionCookie,
  json,
  requestHasSameOrigin,
  requireReader,
  sessionHashFromRequest,
} from "../../_shared/reader-auth.js";

export async function onRequestDelete(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const auth = await requireReader(context);
  if (auth.response) return auth.response;
  const tokenHash = await sessionHashFromRequest(context.request);
  await auth.db.prepare("DELETE FROM reader_sessions WHERE user_id = ?").bind(auth.user.id).run();
  await auth.db.prepare("DELETE FROM reader_progress WHERE user_id = ?").bind(auth.user.id).run();
  await auth.db.prepare("DELETE FROM reader_saved_topics WHERE user_id = ?").bind(auth.user.id).run();
  await auth.db.prepare("DELETE FROM reader_notes WHERE user_id = ?").bind(auth.user.id).run();
  await auth.db.prepare("DELETE FROM reader_users WHERE id = ?").bind(auth.user.id).run();
  if (tokenHash) await auth.db.prepare("DELETE FROM reader_sessions WHERE token_hash = ?").bind(tokenHash).run();
  const headers = new Headers({ "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
