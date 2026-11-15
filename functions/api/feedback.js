import { json } from "../_shared/admin.js";
import { cleanFeedbackField, isPreviewRequest, rateLimitFeedback, syncFeedbackToGitHub, FEEDBACK_TYPES } from "../_shared/feedback.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "This form can only be sent from the Learn About Jainism site." }, 403);
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ error: "Send the form as JSON." }, 415);
  }
  if (!env.LIBRARY_DB) return json({ error: "The feedback inbox is not available right now. Please try again later." }, 503);
  const isPreview = isPreviewRequest(request);
  if (!isPreview && !String(env.GITHUB_FEEDBACK_TOKEN ?? "").trim()) {
    return json({ error: "The feedback form is being connected. Please try again soon." }, 503);
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 18_000) return json({ error: "This report is too long. Please shorten it and try again." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: "The form could not be read. Please check it and try again." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "The form could not be read." }, 400);
  if (cleanFeedbackField(body.website, 300)) return json({ received: true }, 202);

  const type = typeof body.type === "string" && Object.hasOwn(FEEDBACK_TYPES, body.type) ? body.type : "";
  const feedback = cleanFeedbackField(body.feedback);
  const supportingContext = cleanFeedbackField(body.supportingContext);
  let pageUrl = cleanFeedbackField(body.pageUrl, 2000);
  if (!type) return json({ error: "Choose a feedback type." }, 400);
  if (feedback.length < 8) return json({ error: "Add a little more detail so the team can review it." }, 400);
  if (typeof body.formStartedAt !== "number" || Date.now() - body.formStartedAt < 2500 || Date.now() - body.formStartedAt > 2 * 60 * 60 * 1000) {
    return json({ error: "Please complete the form and try again." }, 400);
  }
  if (pageUrl) {
    try {
      const parsedUrl = new URL(pageUrl);
      const requestUrl = new URL(request.url);
      const allowedHost = parsedUrl.origin === requestUrl.origin || parsedUrl.hostname === "learnaboutjainism.com" || parsedUrl.hostname === "www.learnaboutjainism.com" || parsedUrl.hostname.endsWith(".learnaboutjainism.pages.dev");
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") throw new Error("invalid");
      if (!allowedHost || parsedUrl.username || parsedUrl.password) throw new Error("invalid");
      pageUrl = parsedUrl.href;
    } catch {
      return json({ error: "Enter a link to a page on this library." }, 400);
    }
  }

  if (!isPreview) {
    const rate = await rateLimitFeedback(env.LIBRARY_DB, request, env.GITHUB_FEEDBACK_TOKEN);
    if (!rate.allowed) return json({ error: "This connection has sent several reports recently. Please try again in an hour." }, 429);
  }

  const id = crypto.randomUUID();
  try {
    await env.LIBRARY_DB.prepare(`
      INSERT INTO reader_feedback (id, feedback_type, page_url, feedback, supporting_context, github_sync_state)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).bind(id, type, pageUrl, feedback, supportingContext).run();
  } catch {
    return json({ error: "The feedback inbox is updating. Please try again shortly." }, 503);
  }

  const sync = await syncFeedbackToGitHub(env.LIBRARY_DB, id, env, request);
  return json({
    received: true,
    reference: id,
    githubSynced: sync.ok,
    previewOnly: Boolean(sync.preview),
    issueUrl: sync.issueUrl ?? "",
    message: sync.ok
      ? "Your report is in the library review queue."
      : "Your report is in the library review queue. The team will retry the GitHub sync.",
  }, 202);
}
