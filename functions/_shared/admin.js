import { verifyEditor } from "./access.js";
import { currentUser } from "./reader-auth.js";

const MAX_BODY_BYTES = 240_000;

export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

export function topicIdFrom(context) {
  const topicId = String(context.params?.topic_id || "");
  return /^D\d{2}\.T\d{3}$/.test(topicId) ? topicId : "";
}

export async function editorContext(context) {
  const request = context.request;
  const mutating = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (mutating && request.headers.get("origin") !== new URL(request.url).origin) {
    return { response: json({ error: "Request origin did not match." }, 403) };
  }
  let readerAccount = null;
  try {
    readerAccount = await currentUser(request, context.env);
  } catch {
    // Keep Cloudflare Access available while an account database is being migrated.
  }
  if (readerAccount?.user?.role === "librarian") {
    return { db: readerAccount.db, actor: readerAccount.user.email, authMethod: "Google" };
  }
  const claims = await verifyEditor(request, context.env);
  if (!claims) {
    const status = readerAccount?.user ? 403 : 401;
    const message = status === 403
      ? "This Google account can use the reading library but does not have librarian access."
      : "Sign in with an approved librarian account to continue.";
    return { response: json({ error: message }, status) };
  }
  const db = context.env.LIBRARY_DB;
  if (!db) return { response: json({ error: "The shared editorial workspace is not connected yet." }, 503) };
  return { db, actor: claims.email.toLowerCase(), authMethod: "Cloudflare Access" };
}

export async function readBody(request) {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return { error: "This page is larger than the editor can save." };
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? { value } : { error: "The request body must be an object." };
  } catch {
    return { error: "The request body must contain valid JSON." };
  }
}

export async function getTask(db, topicId, create = false) {
  if (create) {
    await db.prepare("INSERT OR IGNORE INTO review_tasks (topic_id) VALUES (?)").bind(topicId).run();
  }
  return db.prepare("SELECT * FROM review_tasks WHERE topic_id = ?").bind(topicId).first();
}

export async function writeTask(db, topicId, actor, expectedVersion, updates, event) {
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) {
    return { response: json({ error: "A current page version is required." }, 400) };
  }
  const current = await getTask(db, topicId, true);
  if (current.version !== expectedVersion) {
    return { response: json({ error: "Another editor updated this page. Reload it before saving again.", currentVersion: current.version }, 409) };
  }

  const updatedAt = new Date().toISOString();
  const status = updates.status ?? current.status;
  const assignee = updates.assignee ?? current.assignee;
  const notes = updates.notes ?? current.notes;
  const draftContent = updates.draftContent === undefined ? current.draft_content : updates.draftContent;
  const publishedContent = updates.publishedContent === undefined ? current.published_content : updates.publishedContent;
  const result = await db.prepare(`
    UPDATE review_tasks
    SET status = ?, assignee = ?, notes = ?, draft_content = ?, published_content = ?,
        version = version + 1, updated_at = ?, updated_by = ?
    WHERE topic_id = ? AND version = ?
  `).bind(status, assignee, notes, draftContent, publishedContent, updatedAt, actor, topicId, expectedVersion).run();
  if (result.meta?.changes !== 1) {
    return { response: json({ error: "Another editor updated this page. Reload it before saving again." }, 409) };
  }

  const nextVersion = expectedVersion + 1;
  await db.prepare(`
    INSERT INTO review_history (topic_id, actor, action, status, note, content_snapshot, version, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(topicId, actor, event.action, status, event.note ?? "", event.contentSnapshot ?? null, nextVersion, updatedAt).run();
  return { task: await getTask(db, topicId), version: nextVersion };
}
