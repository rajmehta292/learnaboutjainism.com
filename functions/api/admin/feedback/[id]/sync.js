import { editorContext, json } from "../../../../_shared/admin.js";
import { syncFeedbackToGitHub } from "../../../../_shared/feedback.js";

export async function onRequestPost(context) {
  const auth = await editorContext(context);
  if (auth.response) return auth.response;
  const id = String(context.params?.id ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Feedback entry not found." }, 404);
  const result = await syncFeedbackToGitHub(auth.db, id, context.env, context.request);
  if (!result.ok) return json({ error: result.reason }, 409);
  return json({ issueNumber: result.issueNumber, issueUrl: result.issueUrl });
}
