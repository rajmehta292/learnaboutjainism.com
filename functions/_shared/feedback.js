export const FEEDBACK_TYPES = {
  correction: "Correction or source issue",
  accessibility: "Accessibility barrier",
  suggestion: "Other suggestion",
};

const GITHUB_API = "https://api.github.com";
const GITHUB_REPOSITORY = "rajmehta292/learnaboutjainism.com";
const MAX_FIELD_LENGTH = 5000;

export function isPreviewRequest(request) {
  const host = new URL(request.url).hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") return true;
  return !["learnaboutjainism.com", "www.learnaboutjainism.com", "learnaboutjainism.pages.dev"].includes(host);
}

export function cleanFeedbackField(value, maximum = MAX_FIELD_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function feedbackTypeLabel(type) {
  return FEEDBACK_TYPES[type] ?? "Other suggestion";
}

export async function rateLimitFeedback(db, request, secret) {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return { allowed: true };

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip)));
  const digest = Array.from(signature, (byte) => byte.toString(16).padStart(2, "0")).join("");
  await db.prepare(`
    INSERT INTO reader_feedback_rate_limits (ip_digest, window_started_at, request_count)
    VALUES (?, CURRENT_TIMESTAMP, 1)
    ON CONFLICT(ip_digest) DO UPDATE SET
      request_count = CASE
        WHEN window_started_at <= datetime('now', '-1 hour') THEN 1
        ELSE request_count + 1
      END,
      window_started_at = CASE
        WHEN window_started_at <= datetime('now', '-1 hour') THEN CURRENT_TIMESTAMP
        ELSE window_started_at
      END
  `).bind(digest).run();
  await db.prepare("DELETE FROM reader_feedback_rate_limits WHERE window_started_at <= datetime('now', '-1 hour')").run();
  const row = await db.prepare("SELECT request_count FROM reader_feedback_rate_limits WHERE ip_digest = ?").bind(digest).first();
  const count = Number(row?.request_count ?? 0);
  return { allowed: count <= 5, remaining: Math.max(0, 5 - count) };
}

function escapeMarkdown(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^(?=### (?:Type of feedback|Page URL|What should we review\?|Supporting source or context)\s*$)/, "\\"))
    .join("\n")
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`");
}

function issueBody(feedback) {
  return [
    `### Type of feedback\n${feedbackTypeLabel(feedback.feedback_type)}`,
    `### Page URL\n${feedback.page_url || "No response"}`,
    `### What should we review?\n${escapeMarkdown(feedback.feedback)}`,
    `### Supporting source or context\n${escapeMarkdown(feedback.supporting_context || "No response")}`,
    `\n---\nReader reference: \`${feedback.id}\``,
  ].join("\n\n");
}

async function findExistingIssue(token, feedbackId) {
  const query = `repo:${GITHUB_REPOSITORY} in:body "Reader reference: ${feedbackId}"`;
  const response = await fetch(`${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&per_page=10`, {
    headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" },
  });
  if (!response.ok) return null;
  const result = await response.json();
  return Array.isArray(result.items) ? result.items.find((issue) => !issue.pull_request) ?? null : null;
}

export async function syncFeedbackToGitHub(db, feedbackId, env, request) {
  if (request && isPreviewRequest(request)) {
    await db.prepare(`
      UPDATE reader_feedback SET github_sync_state = 'preview', github_sync_error = '', updated_at = ?
      WHERE id = ? AND github_issue_number IS NULL
    `).bind(new Date().toISOString(), feedbackId).run();
    return { ok: false, preview: true, reason: "Preview submissions stay in the preview inbox." };
  }
  const token = String(env.GITHUB_FEEDBACK_TOKEN ?? "").trim();
  if (!token) {
    await db.prepare(`
      UPDATE reader_feedback SET github_sync_state = 'failed', github_sync_error = 'GitHub feedback sync is not configured.', updated_at = ?
      WHERE id = ? AND github_issue_number IS NULL
    `).bind(new Date().toISOString(), feedbackId).run();
    return { ok: false, reason: "GitHub feedback sync is not configured." };
  }

  const item = await db.prepare("SELECT * FROM reader_feedback WHERE id = ?").bind(feedbackId).first();
  if (!item) return { ok: false, reason: "Feedback not found." };
  if (item.github_issue_number && item.github_issue_url) return { ok: true, issueNumber: item.github_issue_number, issueUrl: item.github_issue_url };
  if (item.github_sync_state === "preview") return { ok: false, preview: true, reason: "Preview submissions stay in the preview inbox." };

  const claimed = await db.prepare(`
    UPDATE reader_feedback
    SET github_sync_state = 'sending', github_sync_error = '',
        github_sync_started_at = CURRENT_TIMESTAMP, delivery_attempts = delivery_attempts + 1
    WHERE id = ? AND github_issue_number IS NULL
      AND (github_sync_state IN ('pending', 'failed') OR github_sync_started_at <= datetime('now', '-10 minutes'))
  `).bind(feedbackId).run();
  if (claimed.meta?.changes !== 1) {
    return { ok: false, reason: item.github_sync_state === "sending" ? "GitHub sync is already running." : "GitHub issue already exists." };
  }

  try {
    // Recover safely if GitHub created the issue but the Function lost its response before saving the issue number.
    const existing = await findExistingIssue(token, feedbackId);
    let issue = existing;
    if (!issue) {
      const create = await fetch(`${GITHUB_API}/repos/${GITHUB_REPOSITORY}/issues`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          accept: "application/vnd.github+json",
          "content-type": "application/json",
          "x-github-api-version": "2022-11-28",
        },
        body: JSON.stringify({
          title: `Reader feedback: ${feedbackTypeLabel(item.feedback_type)} · ${feedbackId.slice(0, 8)}`,
          body: issueBody(item),
        }),
      });
      if (!create.ok) {
        const error = await create.json().catch(() => ({}));
        throw new Error(`GitHub rejected the submission (${create.status}${error.message ? `: ${String(error.message).slice(0, 180)}` : ""}).`);
      }
      issue = await create.json();
    }

    const syncedAt = new Date().toISOString();
    await db.prepare(`
      UPDATE reader_feedback SET github_issue_number = ?, github_issue_url = ?,
        github_synced_at = ?, github_sync_state = 'synced', github_sync_error = '', updated_at = ?
      WHERE id = ?
    `).bind(issue.number, issue.html_url, syncedAt, syncedAt, feedbackId).run();
    return { ok: true, issueNumber: issue.number, issueUrl: issue.html_url };
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message.slice(0, 300) : "GitHub could not be reached.";
    await db.prepare(`
      UPDATE reader_feedback SET github_sync_state = 'failed', github_sync_error = ?, updated_at = ?
      WHERE id = ? AND github_issue_number IS NULL
    `).bind(safeMessage, new Date().toISOString(), feedbackId).run();
    return { ok: false, reason: safeMessage };
  }
}

export function feedbackJson(item) {
  return {
    id: item.id,
    type: item.feedback_type,
    pageUrl: item.page_url,
    body: item.feedback,
    supportingContext: item.supporting_context,
    status: item.status,
    assignee: item.assignee,
    staffNotes: item.staff_notes,
    githubIssueNumber: item.github_issue_number,
    githubIssueUrl: item.github_issue_url,
    githubSyncedAt: item.github_synced_at,
    githubSyncState: item.github_sync_state,
    githubSyncError: item.github_sync_error,
    deliveryAttempts: item.delivery_attempts,
    version: item.version,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    updatedBy: item.updated_by,
  };
}
