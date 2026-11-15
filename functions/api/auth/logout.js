import {
  clearSessionCookie,
  currentUser,
  json,
  requestHasSameOrigin,
  sessionHashFromRequest,
} from "../../_shared/reader-auth.js";

export async function onRequestPost(context) {
  if (!requestHasSameOrigin(context.request)) return json({ error: "Request origin did not match." }, 403);
  const result = await currentUser(context.request, context.env);
  if (result.db && !result.unavailable) {
    const tokenHash = await sessionHashFromRequest(context.request);
    if (tokenHash) await result.db.prepare("DELETE FROM reader_sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  const headers = new Headers({ "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
