# Google sign-in and reader accounts

Reader accounts run through Cloudflare Pages Functions and the existing **LIBRARY_DB** D1 binding. The Next.js pages remain static. The first successful Google sign-in creates a reader account; no password is stored by this site.

## Google OAuth client

Create an OAuth 2.0 client in Google Cloud Console:

1. Configure the OAuth consent screen with the site name and a support contact.
   - Privacy policy URL: https://learnaboutjainism.com/en/privacy
2. Create a **Web application** OAuth client.
3. Add this authorized JavaScript origin:
   - https://learnaboutjainism.com
4. Add these authorized redirect URIs:
   - https://learnaboutjainism.com/api/auth/google/callback
5. Use the OpenID Connect scopes **openid**, **email**, and **profile**. The site does not request access to other Google services.

Preview sign-in is optional. If Google accepts the preview hostname for your OAuth client, you can also add its origin and callback URI. Google may require verified domains; if it rejects the pages.dev hostname, leave Preview sign-in disabled and use the production domain for the first account sign-in.

If Google keeps the app in testing mode, only test users you add in the consent screen can sign in. Publish the consent app when it is ready for public account creation.

## Cloudflare Pages settings

In **Workers & Pages → learnaboutjainism → Settings → Variables and Secrets**, set these in both Preview and Production environments:

| Name | Type | Preview value | Production value |
| --- | --- | --- | --- |
| GOOGLE_CLIENT_ID | Variable | OAuth client ID, if preview is enabled | OAuth client ID |
| GOOGLE_CLIENT_SECRET | Secret | OAuth client secret, if preview is enabled | OAuth client secret |
| GOOGLE_REDIRECT_URI | Variable | Preview callback URI, if enabled | https://learnaboutjainism.com/api/auth/google/callback |
| LIBRARIAN_EMAILS | Variable | Comma-separated approved librarian email addresses | Comma-separated approved librarian email addresses |

Keep the existing **LIBRARY_DB** binding in each environment. The project already has separate preview and production D1 databases under that binding.

The account migration is **functions/migrations/0002_reader_accounts.sql**. It has been applied to the current Preview and Production D1 databases. Apply it to any new environment's D1 database before enabling OAuth. After changing Pages bindings or variables, redeploy the relevant branch so the Functions receive them.

Do not point Preview at the production callback URI: the login state cookie is host-only and must return to the same hostname that started sign-in. For a temporary deployment URL, register that exact URL and callback URI in a separate Google OAuth client if Google accepts it. Otherwise, leave Preview login unconfigured.

## Librarian access

Every successful Google sign-in receives a reader account. Only emails listed in **LIBRARIAN_EMAILS** receive librarian access to the review and editing workspace. Use a comma-separated list to approve a team. The list is checked on each request, so removing an address revokes Google-based librarian access without changing the account.

The existing Cloudflare Access editor flow remains available as a second sign-in method.

## Reader data

Accounts can save topics, mark them complete, see recently opened topics, and save private notes on topic pages. Account APIs require the signed-in session and scope every database read and write to that account. Notes are plain text, limited to 20,000 characters, and rendered as text. Deleting an account removes its sessions, reading history, saved topics, and notes.

Sessions use random, database-backed tokens in **Secure**, **HttpOnly**, **SameSite=Lax**, host-only cookies. The database stores a SHA-256 hash of the session token, not the token itself. Sessions expire after 30 days; signing out revokes the current session.

## References

- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Google OAuth 2.0 for web server applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
