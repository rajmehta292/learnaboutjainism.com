import {
  encodeBase64Url,
  oauthCookie,
  randomBytesToken,
  safeReturnPath,
  signInLocation,
} from "../../../_shared/reader-auth.js";

const encoder = new TextEncoder();

async function challengeFor(verifier) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  return encodeBase64Url(new Uint8Array(digest));
}

function redirectResponse(location, flow) {
  const headers = new Headers({ location: location.toString(), "cache-control": "no-store" });
  if (flow) oauthCookie(headers, flow);
  return new Response(null, { status: 302, headers });
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const returnTo = safeReturnPath(requestUrl.searchParams.get("return_to") || "/en/account");
  const clientId = String(context.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = String(context.env.GOOGLE_CLIENT_SECRET || "").trim();
  const redirectUri = String(context.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", requestUrl.origin)).trim();
  let callback;
  try { callback = new URL(redirectUri); } catch { return Response.redirect(signInLocation(context.request, returnTo, "configuration"), 302); }

  if (!clientId || !clientSecret || callback.origin !== requestUrl.origin || callback.pathname !== "/api/auth/google/callback") {
    return Response.redirect(signInLocation(context.request, returnTo, "configuration"), 302);
  }

  const state = randomBytesToken(32);
  const nonce = randomBytesToken(32);
  const verifier = randomBytesToken(48);
  const challenge = await challengeFor(verifier);
  const flow = { state, nonce, verifier, returnTo, createdAt: Date.now() };

  const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorization.searchParams.set("client_id", clientId);
  authorization.searchParams.set("redirect_uri", callback.toString());
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("scope", "openid email profile");
  authorization.searchParams.set("state", state);
  authorization.searchParams.set("nonce", nonce);
  authorization.searchParams.set("code_challenge", challenge);
  authorization.searchParams.set("code_challenge_method", "S256");
  authorization.searchParams.set("prompt", "select_account");
  return redirectResponse(authorization, flow);
}
