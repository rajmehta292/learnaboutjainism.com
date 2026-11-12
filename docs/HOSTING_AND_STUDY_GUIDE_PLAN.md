# Hosting and study guide plan

## Hosting recommendation

**Recommended target: Cloudflare Pages Free, served as a static export.** This library is a read-only set of articles and indexes, so it can be rendered during the repository build and served as files. Cloudflare Pages supports static Next.js exports; it does not run a Next.js server for a normal Pages deployment.

Cloudflare Pages Free currently allows 20,000 files per site, a maximum of 25 MiB per file, 500 builds per month, one build at a time, and a 20-minute build timeout. Static asset requests are free and unlimited. The 1 GB figure belongs to Workers KV storage; this site does not currently need KV.

The first static build included all three locale prefixes and produced 25,410 files (541.57 MiB), exceeding the Pages Free file-count limit. Since Hindi and Gujarati content has not been translated or reviewed, the public export includes English only. The latest local export produces **8,524 files totaling 197,147,161 bytes (188.01 MiB)**. The largest file is 229,288 bytes, well below 25 MiB. Pages Free checks file count and per-file size; the total export is not subject to a 1 GB site-storage allowance. The checked-in `src/data` tree contains 1,519 JSON files totaling 12,806,725 bytes (12.21 MiB), with the largest JSON file at 175,436 bytes.

Sources: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Workers pricing and KV allowances](https://developers.cloudflare.com/workers/platform/pricing/), [Cloudflare guide to static Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

### Deployment status

- Cloudflare Pages project `learnaboutjainism` is connected to `rajmehta292/learnaboutjainism.com`, with `main` as the production branch, `npm run build` as the build command, and `out` as the output directory.
- The Pages project successfully built and served a preview from commit `04d4cfa`. The root redirect, Start Here, catalogue, topic page, JSON endpoints, invalid topic 404, and unpublished locale 404 worked in the preview.
- SEO metadata, `robots.txt`, `sitemap.xml`, feedback reporting, and the static link/limit audit have since been added locally. They need a fresh preview check before production promotion.
- PR #1 must be merged to `main` before Cloudflare creates the production deployment. The `learnaboutjainism.com` Cloudflare zone is active and its nameservers already point to Cloudflare; custom-domain attachment, DNS records, and production HTTPS are still launch steps.

The export now generates the English edition's 1,676 catalogue topics and static JSON endpoints. Hindi and Gujarati remain unpublished until their text and interface are translated and reviewed. `npm run site:audit` checks file limits, required routes and metadata files, internal links, API JSON, image alt text, and the draft-topic indexing rule.

Next.js static export does not support Proxy; Cloudflare's `_redirects` file sends `/` to `/en`. The app enumerates topic routes and supported root data filenames at build time, and the JSON endpoints are emitted as static files with JSON response headers. Neither endpoint is used by the current UI, but both are preserved.

If request-time rendering, authenticated areas, or dynamic APIs become necessary, evaluate Cloudflare Workers with vinext and confirm production compatibility and CPU use. The repo's `npx vinext check` reported 100% compatibility for the inspected app surface, but that check was not a production build or CPU measurement. Workers Free includes 100,000 requests per day and 10 ms CPU per invocation; server rendering may exceed that CPU allowance. A static Pages build avoids invoking application code for ordinary reading traffic. See [Cloudflare's Next.js on Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

Vercel is the low-change alternative if preserving conventional Next.js server behavior matters more than static hosting. GitHub Pages and Netlify can also serve the same static export. Compare them if the Pages preview fails a concrete requirement.

## Learning plan from the study notes

The local study notes contain notes from photographed pages of a children's educational booklet and an added research companion. The first eight sections give the site a coherent beginner curriculum; the companion adds comparative context, a glossary, and questions for further study. The working file has not been committed and is used only as a planning source. The notes are useful as a map for teaching, but are not publication-ready source records.

The Start Here page uses six reading paths with questions to guide a reader:

1. **A first orientation** — core terms, diversity, ethics, and liberation.
2. **The Jain cosmos and the wheel of time** — loka, aloka, the traditional cosmic map, and the six eras. Label these as Jain cosmological teachings, not modern astronomy or historical forecasts.
3. **Soul, karma, and liberation** — karma as subtle matter, the principal karmas, the Three Jewels, and moksha. Explain why merit and liberation are not the same goal.
4. **Non-violence, restraint, and many-sided understanding** — ahimsa, mendicant and lay vows, anekantavada, and respectful disagreement. Do not flatten anekantavada into “all views are equally true.”
5. **Jain stories, memory, and history** — Rishabha, Bahubali, Mahavira, Malli, and narrative variation. Label sacred narrative, community tradition, and historically supported claims separately.
6. **Texts, teachers, and living communities** — the fourfold sangha, oral transmission, scriptural traditions, and community differences. Attribute differences to the relevant Jain traditions instead of presenting one account as universal.

### Editorial guardrails for future lessons

- Keep the photographed booklet's teaching voice distinct from the research companion's cross-tradition and academic framing.
- Do not republish private notes, long poem or prayer transcriptions, or booklet prose until the original publication, exact wording, translation, and reuse rights are established.
- Have qualified Jain teachers review ritual, fasting, vow, and practice material. Present practice as community-specific where it varies; do not turn a study page into personal religious instruction.
- Give cosmology and sacred history clear labels. Where historians can assess a claim, explain the evidence and its limits separately from the tradition's account.
- Add a short learning goal, key terms, source links with precise edition or section locators, one or two reflection questions, and a “where traditions differ” note when relevant.
- Keep entries and paths marked as drafts until the reviewer and source record meet the editorial playbook. Draft article and practice pages stay out of search indexes until that standard is met.

### Iterative expansion

1. Use the current paths as the beginner-level map; keep unfinished entries visibly identified.
2. Turn one path at a time into short lessons with reviewed definitions, diagrams or comparisons where useful, a glossary, and linked sources.
3. Add intermediate paths for Jain epistemology, vows and household life, scripture and manuscript transmission, sacred places, festivals, and contemporary Jain communities as source coverage and reviewers allow.
4. Gather corrections from readers and teachers, record what changed, then revise the lesson and its source record together.

The review queue is substantial: 1,489 topic files exist as drafts, 187 catalogue topics have no draft file, none has a complete human review record, and 949 topics are flagged for safety-sensitive review. The automated content audit identifies structural gaps and terms for triage; it does not fact-check. Qualified Jain educators, textual specialists, and clinical reviewers for relevant safety-sensitive material remain essential for the next content phase.
