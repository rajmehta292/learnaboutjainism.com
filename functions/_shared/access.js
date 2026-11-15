let cachedKeys = null;
let cachedKeysUntil = 0;
let cachedIssuer = "";

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getKeys(issuer) {
  if (cachedKeys && cachedIssuer === issuer && Date.now() < cachedKeysUntil) return cachedKeys;
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Cloudflare Access signing keys could not be loaded.");
  const data = await response.json();
  if (!Array.isArray(data.keys)) throw new Error("Cloudflare Access signing keys were not valid.");
  cachedKeys = data.keys;
  cachedIssuer = issuer;
  cachedKeysUntil = Date.now() + 10 * 60 * 1000;
  return cachedKeys;
}

export async function verifyEditor(request, env) {
  const teamDomain = String(env.ACCESS_TEAM_DOMAIN || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const expectedAudience = String(env.ACCESS_API_AUD || "").trim();
  if (!teamDomain || !expectedAudience || !teamDomain.endsWith(".cloudflareaccess.com")) return null;

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;
  const [encodedHeader, encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature || extra !== undefined) return null;

  let header;
  let claims;
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader)));
    claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || typeof header.kid !== "string") return null;

  const issuer = `https://${teamDomain}`;
  if (String(claims.iss || "").replace(/\/$/, "") !== issuer) return null;
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(expectedAudience)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp <= now || (typeof claims.nbf === "number" && claims.nbf > now + 30)) return null;
  if (typeof claims.email !== "string" || !claims.email.includes("@")) return null;

  try {
    const keys = await getKeys(issuer);
    const jwk = keys.find((key) => key.kid === header.kid && key.kty === "RSA");
    if (!jwk) return null;
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const verified = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      base64UrlToBytes(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    );
    return verified ? claims : null;
  } catch {
    return null;
  }
}
