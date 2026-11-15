# Editorial workspace

The librarian workspace is at `/en/admin`. Its overview, review center, page tracker, editor, feedback inbox, and workflow guide share one Cloudflare D1 editorial database. The production and preview environments use separate databases.

## Who can sign in

Librarians can sign in with an approved Google account (`LIBRARIAN_EMAILS`) or a Cloudflare Access email one-time PIN allowed by the **Library editors** policy. Add each collaborator to the Cloudflare Access allow policy and, when Google sign-in is used, to the `LIBRARIAN_EMAILS` allowlist. A page assignment does not grant access.

## Workspace pages

- **Overview** shows article review counts, saved drafts, new reader reports, recent page activity, and the next actions.
- **Review center** lists topic articles that still need review. Use search and status filters to work through a bounded queue.
- **All pages** tracks every topic, including entries without an article.
- **Page editor** stores a working copy, assignment, internal notes, source checklist, reviewer details, and prior page versions.
- **Feedback inbox** holds visitor corrections and accessibility reports. Librarians can assign an owner, update status, add private staff notes, retry GitHub sync, and read the activity history.
- **Review workflow** explains the shared steps and what to record at each stage.

## Review an article

1. Open **Review center** and choose an article, or use **All pages** to locate an entry.
2. Assign a librarian and state the next action in the internal review notes.
3. Edit a working copy. For each source, name the source, link to it, identify its type, and give a precise page, chapter, section, or verse.
4. Compare the cited passage with the claim it is meant to support. Attribute community-specific practices and distinct accounts to the relevant Jain tradition.
5. Add a concise review note and the reviewer's role or relevant experience. Check the source list and page, then use **Verify and publish**.
6. Check the public page. Resolve any reader report that the edit addresses, or explain why no change was made.

Each save records the editor, time, status, version, and note. A page version check prevents an editor from silently overwriting newer work. Prior content snapshots can be restored from page history. Drafts remain separate from the live topic file until publication.

## Triage reader feedback

1. Open **Feedback inbox** and filter to open reports.
2. Read the report and supporting context. Open the page link when one is provided. Reader reports are public; do not copy personal information into staff notes.
3. Set the status, assign a librarian, and write the next action in **Staff notes**. These notes are available to librarians in the workspace and are not sent to GitHub.
4. Work on the related article in the page editor. Link the topic ID in staff notes when the report concerns a specific entry.
5. Record the outcome in the report history and mark it **Resolved** or **Dismissed** when the next action is complete. Leave a clear explanation for a dismissal.

The feedback status values are **New**, **Triaged**, **In progress**, **Resolved**, and **Dismissed**. GitHub delivery has its own status; a failed delivery can be retried from the inbox. Preview deployments save feedback only to the preview database and never create public GitHub issues.

## How visitor feedback is stored

The public form at `/en/feedback` does not require a visitor account or collect an email address. It stores the report in the private D1 review inbox, then creates a public issue in this repository with the server-side `GITHUB_FEEDBACK_TOKEN`. The existing `Record reader feedback` GitHub Actions workflow adds or updates the corresponding row in [`reader-feedback.csv`](reader-feedback.csv) on `main`.

The GitHub fine-grained token should be restricted to this repository and grant **Issues: read and write** only. Store it as the encrypted Cloudflare Pages production secret named `GITHUB_FEEDBACK_TOKEN`; never add it to a build variable, source file, or public browser code. The production form returns a setup message until this secret exists. A report whose GitHub request fails is retained in D1 and can be retried by a librarian. GitHub issues and the CSV are public, so visitors are told not to submit names, contact details, or other private information.

The form checks same-origin requests, limits field length, uses a hidden honeypot and minimum completion time, and limits each Cloudflare IP to five reports per hour using an HMAC digest. The raw IP is not stored. Reports from people behind the same network share that limit. The secret is also needed for safe keyed rate-limit storage.

## Apply database migrations

Each `functions/migrations/NNNN_*.sql` file is additive and must be applied to the D1 database bound to the target Pages environment before the matching code is deployed there.

- Preview: use the `LIBRARY_DB` binding under Pages project **Settings → Functions → D1 database bindings**, then apply the new migration to the preview database.
- Production: apply the same migration to the production `LIBRARY_DB` database before merging/deploying the feature to `main`.

Do not apply a production migration by selecting the preview database or vice versa. Migration `0003_reader_feedback.sql` creates the feedback inbox, its history, and rate-limit tables. It does not modify reader accounts or existing article data.

## Add a librarian

1. In Cloudflare Zero Trust, open **Access → Applications → Jainism Library Editorial Workspace**.
2. Add the collaborator's exact email address to the **Library editors** allow policy.
3. If they will sign in through Google, add the same address to `LIBRARIAN_EMAILS` in the Pages environment.
4. Ask them to sign in at `https://learnaboutjainism.com/en/admin`.
5. Assign pages or reports using the address they use in the workspace.

Keep access limited to named collaborators and review the allowlist when someone leaves.
