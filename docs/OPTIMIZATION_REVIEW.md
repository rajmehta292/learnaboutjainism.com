# Optimization and cleanup review

**Reviewed:** 2026-11-15

**Scope:** repository, static export, reading experience, editorial tooling, and deployment dependencies.

## Changes in this pass

- Added a summary-only librarian API response and stopped the feedback/workflow pages from downloading the 1,401-row topic catalogue.
- Added an account-free feedback route and D1 inbox, with bounded submissions, same-origin protection, honeypot/timing checks, and a keyed IP rate limit. The public report is written to GitHub by a Pages Function secret, while D1 keeps the private assignment and staff history.
- Added a searchable feedback inbox, status counts, assignments, private staff notes, a per-report activity history, and a GitHub retry action.
- Expanded the overview with draft, new-feedback, and content-needed counts, a review-flow diagram, and recent reports.
- Added a librarian workflow page and updated the written workspace guide.
- Isolated Preview report submissions from the public issue tracker.

## Verified static-export findings

The export after this pass contained 8,955 files and 481.44 MiB of raw assets. It had 1,477 HTML files, 1,401 catalogue topic pages, 76,776 internal links, 2,850 social-image references, 29 static API JSON files, and no inline images. Its largest file was 338,157 bytes. The export remains below the current [Pages file-count and per-file limits](https://developers.cloudflare.com/pages/platform/limits/) documented by Cloudflare, but the 481.44 MiB total is a build and deployment footprint, not a per-visit download measurement.

Generated `.txt` route payloads account for about 325.38 MiB and HTML accounts for about 142.32 MiB. The ordinary article route remains static, so a reader fetches the route they open plus assets and any browser-prefetched links; the aggregate output size does not equal the bytes every visitor downloads. No browser performance trace was collected in this pass, so changes to prefetching, fonts, or route chunking should wait for measured network and Core Web Vitals data.

The first client chunks in the audited export were approximately 229 KiB, 170 KiB, and 113 KiB raw, with an 86 KiB stylesheet. These are individual generated assets, not their compressed transfer sizes or page totals. Re-measure the home page, topic page, search, and admin routes on mobile before changing bundling.

## Cleanup review

- **Do not remove the 88 unlisted topic files yet.** They are outside the catalogue, but may hold research worth restoring. A content owner should classify each as restore, archive, or remove; then the audit can enforce the resulting policy.
- **Do not publish the `.raw.txt` source material.** Determine which are source captures, edit drafts, and duplicate exports. Preserve citation and reuse context before consolidating any of them.
- **Keep generated build output out of Git.** `.next`, `out`, generated topic-data copies, and local environment files are already ignored. Confirm deployment artifact size from Cloudflare rather than committing generated output.
- **Retain the CSV feedback ledger and workflow.** The ledger is still used by spreadsheet readers and the GitHub Actions workflow updates it when public issues change.
- **Review `temp_research` and locally held study notes as source material, not deployable site content.** Extract verified citations and reusable material into the editorial workflow; do not publish private notes or long copyrighted text without rights review.
- **Do not delete unreferenced assets or datasets by filename alone.** Check imports, generated route dependencies, history, and licensing before removal.

## Highest-value next work

1. **Finish human source review.** The catalogue has 1,401 listed topics, zero complete human review records, and 4,873 legacy source entries without a complete URL, named edition/type, and exact locator. Start with the beginner path and record findings in the librarian review system.
2. **Reduce the first-read burden.** For each reviewed page, add a one-paragraph answer, a short key-term list, descriptive section headings, related topics, and one or two useful questions. Avoid repeating editorial process text in the reader flow.
3. **Add factual diagrams after source review.** Prioritize soul and karma, the Three Jewels, vows across lay and mendicant practice, and the traditional Jain cosmos. Every diagram needs source-specific labels, alt text, a full text equivalent, and qualified review; describe cosmology as a Jain account rather than modern astronomy.
4. **Improve discovery.** Search should cover aliases, transliteration, Gujarati/Hindi terms, and reviewed article text. Make result previews show why a page matches.
5. **Close accessibility gaps.** Check keyboard flow, screen-reader names, text scaling to 200%, color contrast, reduced motion, and narrow and landscape mobile layouts in a real browser.
6. **Instrument real performance.** Capture mobile and desktop traces for the home, topic, search, and admin pages. Compare compressed transfer size, render-blocking fonts, LCP/CLS/INP, and any route prefetch requests before tuning.
7. **Reconcile workflow roles.** The current editor supports shared assignments and history. If the library adopts mandatory independent review, add an explicit second-review state and prevent publication until it is recorded; the current workflow does not enforce that policy.
8. **Complete deployment setup.** Apply migration `0003_reader_feedback.sql` to preview and production separately, set `GITHUB_FEEDBACK_TOKEN` as a Cloudflare Pages production secret, and submit one real report after deployment to verify D1, GitHub Issues, GitHub Actions, and the CSV end to end.

## Operational limits

The feedback inbox currently returns the newest 250 reports. If that grows, add cursor pagination and a date filter. Rate limiting is five submissions per IP per hour; shared networks can reach that threshold together. The HMAC key comes from the GitHub secret, which is required for live GitHub sync and the keyed rate-limit digest. Preview deployments save reports only in preview D1.

The domain currently has a Cloudflare Pages production and preview D1 binding. The Pages Function secret is not in source control. GitHub's issue creation endpoint requires a fine-grained token with repository **Issues: write**; the GitHub Actions workflow separately needs repository **Contents: write** to update the CSV.
