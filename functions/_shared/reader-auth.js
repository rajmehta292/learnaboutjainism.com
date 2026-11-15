const SESSION_COOKIE = "__Host-laj_session";
const OAUTH_COOKIE = "__Host-laj_oauth";
const encoder = new TextEncoder();

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomToken(byteLength = 32) {
  return base64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cookieValue(request, name) {
  const cookies = request.headers.get("cookie") || "";
  const prefix = name + "=";
  for (const part of cookies.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      try { return decodeURIComponent(trimmed.slice(prefix.length)); } catch { return ""; }
    }
  }
  return "";
}

function setCookie(headers, name, value, maxAge) {
  headers.append("set-cookie", name + "=" + encodeURIComponent(value) + "; Path=/; Max-Age=" + maxAge + "; Secure; HttpOnly; SameSite=Lax");
}

function clearCookie(headers, name) {
  setCookie(headers, name, "", 0);
}

export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store, private",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    },
  });
}

export function requestHasSameOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export function safeReturnPath(value, fallback = "/en/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return fallback;
  }
  try {
    const parsed = new URL(value, "https://learnaboutjainism.com");
    if (parsed.origin !== "https://learnaboutjainism.com") return fallback;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

export function signInLocation(request, returnTo, error) {
  const safePath = safeReturnPath(returnTo);
  const locale = /^\/(en|gu|hi)(?:\/|$)/.exec(safePath)?.[1] || "en";
  const target = new URL("/" + locale + "/sign-in", request.url);
  if (error) target.searchParams.set("error", error);
  target.searchParams.set("return_to", safePath);
  return target;
}

export function readOAuthFlow(request) {
  try {
    return JSON.parse(cookieValue(request, OAUTH_COOKIE));
  } catch {
    return null;
  }
}

export function oauthCookie(headers, flow) {
  setCookie(headers, OAUTH_COOKIE, JSON.stringify(flow), 600);
}

export function clearOAuthCookie(headers) {
  clearCookie(headers, OAUTH_COOKIE);
}

export function setSessionCookie(headers, token, maxAge = 60 * 60 * 24 * 30) {
  setCookie(headers, SESSION_COOKIE, token, maxAge);
}

export function clearSessionCookie(headers) {
  clearCookie(headers, SESSION_COOKIE);
}

function librarianEmails(env) {
  return String(env.LIBRARIAN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isLibrarian(email, env) {
  return librarianEmails(env).includes(String(email || "").toLowerCase());
}

export async function currentUser(request, env) {
  const db = env.LIBRARY_DB;
  if (!db) return { db: null, user: null, unavailable: true };
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token || token.length > 128) return { db, user: null };

  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const record = await db.prepare(
    "SELECT u.id, u.email, u.name, u.created_at AS createdAt " +
    "FROM reader_sessions s JOIN reader_users u ON u.id = s.user_id " +
    "WHERE s.token_hash = ? AND s.expires_at > ? LIMIT 1"
  ).bind(tokenHash, now).first();
  if (!record) return { db, user: null };
  return {
    db,
    user: {
      id: record.id,
      email: record.email,
      name: record.name,
      createdAt: record.createdAt,
      role: isLibrarian(record.email, env) ? "librarian" : "reader",
    },
  };
}

export async function requireReader(context) {
  const result = await currentUser(context.request, context.env);
  if (result.unavailable) return { response: json({ error: "The account database is not connected yet." }, 503) };
  if (!result.user) return { response: json({ error: "Sign in with Google to use your reading account." }, 401) };
  return result;
}

export function topicIdFrom(context) {
  const topicId = String(context.params?.topic_id || "");
  return /^D\d{2}\.T\d{3}$/.test(topicId) ? topicId : "";
}

export async function readJsonBody(request, maxBytes = 24_000) {
  const raw = await request.text();
  if (encoder.encode(raw).byteLength > maxBytes) return { error: "This note is too long to save." };
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? { value } : { error: "The request body must be an object." };
  } catch {
    return { error: "The request body must contain valid JSON." };
  }
}

export async function sessionHashFromRequest(request) {
  const token = cookieValue(request, SESSION_COOKIE);
  return token && token.length <= 128 ? sha256(token) : "";
}

export function randomBytesToken(byteLength = 32) {
  return randomToken(byteLength);
}

export function encodeBase64Url(bytes) {
  return base64Url(bytes);
}

export async function hashSessionToken(token) {
  return sha256(token);
}
