import { currentUser, json } from "../../_shared/reader-auth.js";

export async function onRequestGet(context) {
  try {
    const result = await currentUser(context.request, context.env);
    if (result.unavailable) return json({ error: "The account database is not connected yet." }, 503);
    return json({ user: result.user });
  } catch {
    return json({ error: "The account service is temporarily unavailable." }, 503);
  }
}
