# Launch checklist

## Deployment status

- [x] Create a Cloudflare Pages Free project named `learnaboutjainism` and connect it to this GitHub repository.
- [x] Set `npm run build` as the build command and `out` as the static output directory.
- [x] Confirm the project stays within Pages Free's file-count and per-file limits.
- [x] Add canonical metadata, a production-domain sitemap, and a robots file. Draft topic pages and practice pages stay `noindex` until qualified review.
- [x] Add a public reader-feedback issue form for corrections and accessibility reports.
- [ ] Push the final audited revision, verify its Cloudflare preview, and merge PR #1 to the production branch.
- [ ] Attach `learnaboutjainism.com` and `www.learnaboutjainism.com` to the Pages project, then verify DNS and HTTPS.
- [ ] Check the production root redirect, core pages, topic search, reviewed/draft article behavior, JSON endpoints, sitemap, robots file, and 404 response.
- [ ] Add an uptime check after the production URL is available.

## Repository and build

- Keep the export below Cloudflare Pages Free limits (20,000 files and 25 MiB per file). The latest locally audited build is summarized in [the hosting plan](HOSTING_AND_STUDY_GUIDE_PLAN.md).
- Run `npm run lint`, `npm run content:audit`, `npm run build`, and `npm run site:audit` in CI.
- Keep production credentials out of Git; this static deployment currently requires no runtime secrets.
- If the site later needs request-time rendering or authenticated features, evaluate Cloudflare Workers with vinext and measure production CPU use before migrating.

## Content and public claims

- Be explicit that the catalogue and supplemental datasets are still under editorial review. Do not describe Hindi or Gujarati as translated editions.
- Keep detailed ritual, fasting, health, and end-of-life guidance out of reviewed reference content until qualified community, textual, and clinical reviewers have assessed it.
- Keep the photographed study notes and long text transcriptions private until publication, wording, translation, and reuse rights are established.
- Review the content queues in small batches; update the entry and its source record together.
