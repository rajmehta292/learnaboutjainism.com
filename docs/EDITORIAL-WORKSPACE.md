# Editorial workspace

The editor workspace lives at `/en/admin`. Cloudflare Access protects the dashboard and its write APIs with an email one-time PIN. Access is restricted to the addresses listed in the **Library editors** policy.

## Add an editor

1. In Cloudflare Zero Trust, open **Access → Applications → Jainism Library Editorial Workspace**.
2. Edit the **Library editors** allow policy and add the collaborator's exact email address.
3. Ask them to sign in at `https://learnaboutjainism.com/en/admin` with that same address.
4. Assign pages to the collaborator by email in the page editor. Their edits, review notes, and decisions appear in the shared activity history.

Keep the allow policy limited to specific people. A page assignment by itself does not grant sign-in access.

## Review a page

1. Open **Review center** and choose an article, or use **All pages** to find an entry.
2. Edit the overview and structured content. Add a source URL, source type, and exact page or section for each citation.
3. Open each citation and compare it with the claim on the page. Mark each source and the page as checked.
4. Add a review note and your role or relevant experience, then select **Verify and publish**.

The service records the reviewer, date, notes, content revision, and status. A verified article is visible on its public page and is added to the live sitemap. Every save uses a page version, so an editor is asked to reload if someone else has saved a newer version. Previous content snapshots can be restored from page history.

## Preview and production data

Cloudflare Pages uses separate D1 databases for preview deployments and production. Preview assignments and decisions stay in the preview database; production uses its own review history. The database binding is named `LIBRARY_DB` in both environments.
