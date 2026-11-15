# Reader feedback

The **Suggest a correction or accessibility fix** link opens the account-free form at `/en/feedback`. It does not collect a visitor email address. The form explains that reports from the live site are public and asks people not to include personal or confidential details.

Each live report is first saved to the private librarian inbox in Cloudflare D1, then sent to the public GitHub issue tracker. GitHub Actions copies the matching issue into [`reader-feedback.csv`](reader-feedback.csv) on `main`. The row tracks the issue number, dates, type, page URL, report, supporting context, public issue link, and issue state. Later issue edits, closures, or reopenings update that row.

The Cloudflare Pages production environment needs the encrypted `GITHUB_FEEDBACK_TOKEN` secret. Use a GitHub fine-grained token limited to this repository with the **Issues** permission set to **Read and write**. The workflow that updates the CSV uses GitHub Actions' own short-lived `GITHUB_TOKEN` with `contents: write`; the Pages secret does not grant repository content write access.

If GitHub is temporarily unavailable, the report remains in the librarian inbox with a failed sync state and can be retried from the dashboard. Preview reports are isolated in the preview D1 database and are never posted to the public repository. Apply migration `0003_reader_feedback.sql` to the matching D1 environment before deploying this feature there.

The endpoint checks same-origin requests, limits report sizes, filters automated submissions with a honeypot and minimum completion time, and allows up to five reports per IP per hour. The rate-limit table stores a keyed HMAC digest rather than a raw IP address and deletes expired entries.

The direct GitHub issue template remains available to signed-in contributors. GitHub requires an account for that separate route; the website form does not.
