# Launch checklist

## Production status

- [x] Create the Cloudflare Pages Free project `learnaboutjainism` and connect `rajmehta292/learnaboutjainism.com`.
- [x] Build with `npm run build` and publish the static export from `out` on pushes to `main`.
- [x] Keep the Cloudflare Pages Git build watch set to `*`, so repository changes trigger deployments.
- [x] Merge PR #1 to `main`; the initial production deployment `0347e78f-e361-4efb-8f20-04066f11bc33` succeeded from commit `f26d404a4af12e98b05ad9402b1b19688b61ad05`.
- [x] Attach `learnaboutjainism.com` and `www.learnaboutjainism.com` to the Pages project. Both custom domains report active DNS and HTTP validation.
- [x] Add proxied DNS CNAME records for the apex and `www`, both targeting `learnaboutjainism.pages.dev`.
- [x] Redirect `www.learnaboutjainism.com` to the canonical apex with a permanent 301 while preserving the path and query string.
- [x] Verify HTTPS, root redirect, learning pages, a topic page, JSON endpoints, robots, sitemap, favicon, and a missing-topic 404 on production.
- [x] Add a GitHub Actions availability check that runs every six hours and on pull requests, with manual dispatch in `.github/workflows/site-uptime.yml`.

The site is live at [learnaboutjainism.com](https://learnaboutjainism.com/). The initial deployment URL is [0347e78f.learnaboutjainism.pages.dev](https://0347e78f.learnaboutjainism.pages.dev/).

## Repository and build

- Keep the export below Cloudflare Pages Free limits (20,000 files and 25 MiB per file). The latest audited build is summarized in [the hosting plan](HOSTING_AND_STUDY_GUIDE_PLAN.md).
- Run `npm run lint`, `npm run content:audit`, `npm run build`, and `npm run site:audit` in CI.
- Keep production credentials out of Git; this static deployment currently requires no runtime secrets.
- If the site later needs request-time rendering or authenticated features, evaluate Cloudflare Workers with vinext and measure production CPU use before migrating.

## Content and public claims

- Be explicit that the catalogue and supplemental datasets are still under editorial review. Do not describe Hindi or Gujarati as translated editions.
- Keep detailed ritual, fasting, health, and end-of-life guidance out of reviewed reference content until qualified community, textual, and clinical reviewers have assessed it.
- Keep the photographed study notes and long text transcriptions private until publication, wording, translation, and reuse rights are established.
- Review the content queues in small batches; update the entry and its source record together.
