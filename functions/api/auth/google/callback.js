import {
  clearOAuthCookie,
  hashSessionToken,
  randomBytesToken,
  readOAuthFlow,
  safeReturnPath,
  setSessionCookie,
  signInLocation,
} from "../../../_shared/reader-auth.js";

let cachedGoogleKeys = null;
let cachedGoogleKeysUntil = 0;

function decodeJson(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))));
}

async function googleKeys() {
  if (cachedGoogleKeys && Date.now() < cachedGoogleKeysUntil) return cachedGoogleKeys;
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs", { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Google signing keys could not be loaded.");
  const data = await response.json();
  if (!Array.isArray(data.keys)) throw new Error("Google signing keys were invalid.");
  cachedGoogleKeys = data.keys;
  cachedGoogleKeysUntil = Date.now() + 60 * 60 * 1000;
  return cachedGoogleKeys;
}

async function verifyIdToken(token, expectedClientId, expectedNonce) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("Google returned an invalid identity token.");
  const header = decodeJson(parts[0]);
  const claims = decodeJson(parts[1]);
  if (header.alg !== "RS256" || typeof header.kid !== "string") throw new Error("Google used an unsupported token signature.");

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!["https://accounts.google.com", "accounts.google.com"].includes(claims.iss)) throw new Error("The identity token issuer did not match Google.");
  if (!audiences.includes(expectedClientId)) throw new Error("The identity token was issued for another application.");
  if (!Number.isFinite(claims.exp) || claims.exp <= now || !Number.isFinite(claims.iat) || claims.iat > now + 60) throw new Error("The identity token has expired or is not yet valid.");
  if (claims.nonce !== expectedNonce) throw new Error("The sign-in request could not be verified.");
  if (typeof claims.sub !== "string" || !claims.sub || typeof claims.email !== "string" || claims.email_verified !== true) throw new Error("Google did not verify this email address.");

  const keys = await googleKeys();
  const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) throw new Error("Google's signing key was not found.");
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signaturePart = parts[2];
  const signature = Uint8Array.from(
    atob(signaturePart.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(signaturePart.length / 4) * 4, "=")),
    (character) => character.charCodeAt(0),
  );
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    new TextEncoder().encode(parts[0] + "." + parts[1]),
  );
  if (!verified) throw new Error("Google's identity token signature was invalid.");
  return claims;
}

function redirectWithError(request, returnTo, error) {
  const headers = new Headers({ location: signInLocation(request, returnTo, error).toString(), "cache-control": "no-store" });
  clearOAuthCookie(headers);
  return new Response(null, { status: 303, headers });
}

function safeProfileText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

export async function onRequestGet(context) {
  const request = context.request;
  const url = new URL(request.url);
  const flow = readOAuthFlow(request);
  const returnTo = safeReturnPath(flow?.returnTo || "/en/account");
  if (!flow || !flow.state || !flow.nonce || !flow.verifier || Date.now() - Number(flow.createdAt) > 10 * 60 * 1000) {
    return redirectWithError(request, returnTo, "expired");
  }
  if (url.searchParams.get("error")) return redirectWithError(request, returnTo, "cancelled");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== flow.state) return redirectWithError(request, returnTo, "state");

  const clientId = String(context.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = String(context.env.GOOGLE_CLIENT_SECRET || "").trim();
  const redirectUri = String(context.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", url.origin)).trim();
  let callback;
  try { callback = new URL(redirectUri); } catch { return redirectWithError(request, returnTo, "configuration"); }
  if (!clientId || !clientSecret || callback.origin !== url.origin || callback.pathname !== "/api/auth/google/callback") {
    return redirectWithError(request, returnTo, "configuration");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callback.toString(),
        grant_type: "authorization_code",
        code_verifier: flow.verifier,
      }),
    });
    if (!tokenResponse.ok) return redirectWithError(request, returnTo, "google");
    const tokens = await tokenResponse.json();
    const claims = await verifyIdToken(tokens.id_token, clientId, flow.nonce);
    const db = context.env.LIBRARY_DB;
    if (!db) return redirectWithError(request, returnTo, "database");

    const email = String(claims.email).trim().toLowerCase();
    const name = safeProfileText(claims.name || email.split("@")[0], 120);
    const now = new Date().toISOString();
    const userId = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO reader_users (id, google_sub, email, name, created_at, updated_at) " +
      "VALUES (?, ?, ?, ?, ?, ?) " +
      "ON CONFLICT(google_sub) DO UPDATE SET email = excluded.email, name = excluded.name, " +
      "updated_at = excluded.updated_at"
    ).bind(userId, claims.sub, email, name, now, now).run();
    const user = await db.prepare("SELECT id FROM reader_users WHERE google_sub = ?").bind(claims.sub).first();
    if (!user?.id) throw new Error("The account could not be created.");

    const token = randomBytesToken(32);
    const tokenHash = await hashSessionToken(token);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare("INSERT INTO reader_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
      .bind(tokenHash, user.id, expiresAt, now).run();

    const target = new URL(returnTo, url.origin);
    const headers = new Headers({ location: target.toString(), "cache-control": "no-store", "referrer-policy": "no-referrer" });
    setSessionCookie(headers, token);
    clearOAuthCookie(headers);
    return new Response(null, { status: 303, headers });
  } catch {
    return redirectWithError(request, returnTo, "google");
  }
}
