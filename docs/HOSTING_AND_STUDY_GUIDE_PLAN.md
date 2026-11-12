# Hosting and study guide plan

## Hosting recommendation

**Recommended target: Cloudflare Pages Free, served as a static export.** This library is primarily a read-only set of articles and indexes, so it can be rendered when the repository builds and served as files. Cloudflare Pages supports static Next.js exports; it does not run a Next.js server for a normal Pages deployment.

Cloudflare Pages Free currently allows 20,000 files per site, a maximum of 25 MiB per file, 500 builds per month, one build at a time, and a 20-minute build timeout. Static asset requests are free and unlimited. The 1 GB figure belongs to Workers KV storage; this site does not currently need KV.

The first static build included all three locale prefixes and produced 25,410 files (541.57 MiB), exceeding the Pages Free file-count limit. Since Hindi and Gujarati content has not been translated or reviewed, the public export now includes English only. Its measured output is **8,520 files totaling 190,355,385 bytes (181.54 MiB)**. The largest file is 229,288 bytes, well below 25 MiB. The Pages Free limit is based on file count and per-file size; it is not a 1 GB site-storage allowance. The checked-in `src/data` tree itself contains 1,519 JSON files totaling 12,806,725 bytes (12.21 MiB), with the largest JSON file at 175,436 bytes.

Sources: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Workers pricing and KV allowances](https://developers.cloudflare.com/workers/platform/pricing/), [Cloudflare guide to static Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

### Export status and remaining preview checks

The static-export pass is in place and `npm run build` generated 1,721 static routes for the English edition, including all 1,676 catalogue topics and the JSON endpoints. It took about three minutes locally. The Pages limit check passed for this build. Enabling Hindi and Gujarati at the current catalogue size would exceed the 20,000-file Free limit, so those routes stay unpublished until translated content is ready or the host plan changes.

Next.js static export does not support Proxy; Cloudflare's `_redirects` file sends `/` to `/en`. The app enumerates topic routes and supported root data filenames during the build, and both JSON endpoints are emitted as static files with JSON response headers. Neither endpoint is used by the current UI, but both were preserved.

Before connecting the production domain, check the home page, search, every catalogue path, JSON response headers, 404 page, and root redirect in a Pages preview. The generated output files are present locally, but a live Pages preview has not yet been deployed.

Next.js documents static exports and lists Proxy and request-dependent route handlers among unsupported features: [Static exports](https://nextjs.org/docs/app/guides/static-exports). Cloudflare's setup guide also expects a Next.js static HTML export and an `out` build directory.

### Runtime alternative

If the site later needs request-time rendering, authenticated areas, or dynamic APIs, use Cloudflare Workers with the Next.js compatibility path. Cloudflare currently recommends vinext for new Next.js deployments on Workers. The repo's `npx vinext check` reported 100% compatibility for the inspected app surface, but that check is not a production build or a CPU measurement. Workers Free includes 100,000 requests per day and 10 ms CPU per invocation; server rendering may exceed that CPU allowance. A static Pages build avoids invoking application code for ordinary reading traffic. See [Cloudflare's Next.js on Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

Vercel remains the low-change alternative if preserving the current conventional Next.js server behavior matters more than using Cloudflare's static free tier. GitHub Pages and Netlify are also candidates for the same static export. Compare them only if the static Pages preview fails a concrete requirement.

No deployment project, production credentials, or domain records have been added. `learnaboutjainism.com` still needs custom-domain setup after a preview is accepted.

## Learning plan from the study notes

The local study notes contain two different kinds of material: notes from photographed pages of a children's educational booklet, and an added research companion. The first eight sections give the site a coherent beginner curriculum; the research companion adds comparative context, a glossary, and questions for further study. The working file has not been committed and is being used only as a planning source. The notes are useful as a map for teaching, but are not publication-ready source records.

The Start Here page now uses six reading paths with questions to guide a reader:

1. **A first orientation** — core terms, diversity, ethics, and liberation.
2. **The Jain cosmos and the wheel of time** — loka, aloka, the traditional cosmic map, and the six eras. Label these as Jain cosmological teachings, not modern astronomy or historical forecasts.
3. **Soul, karma, and liberation** — karma as subtle matter, the principal karmas, the Three Jewels, and moksha. Explain why merit and liberation are not the same goal.
4. **Non-violence, restraint, and many-sided understanding** — ahimsa, mendicant and lay vows, anekantavada, and respectful disagreement. Do not flatten anekantavada into “all views are equally true.”
5. **Jain stories, memory, and history** — Rishabha, Bahubali, Mahavira, Malli, and narrative variation. Label sacred narrative, community tradition, and historically supported claims separately.
6. **Texts, teachers, and living communities** — the fourfold sangha, oral transmission, scriptural traditions, and community differences. Attribute differences to the relevant Jain traditions instead of presenting one account as universal.

### Editorial guardrails for future lessons

- Keep the photographed booklet's teaching voice distinct from the research companion's cross-tradition and academic framing.
- Do not republish the private notes, long poem or prayer transcriptions, or booklet prose as site content until the original publication, exact wording, translation, and reuse rights are established.
- Have qualified Jain teachers review ritual, fasting, vow, and practice material. Present practice as community-specific where it varies, and do not turn a study page into personal religious instruction.
- Give cosmology and sacred history clear labels. Where historians can assess a claim, explain the evidence and its limits separately from the tradition's account.
- Add a short learning goal, key terms, source links with precise edition or section locators, one or two reflection questions, and a “where traditions differ” note when relevant.
- Keep entries and paths marked as drafts until a qualified reviewer and source record meet the editorial playbook.

### Iterative expansion

1. Use the current paths as the beginner-level map; keep unfinished entries visibly identified.
2. Turn one path at a time into short lessons with reviewed definitions, a diagram or comparison where useful, a glossary, and linked sources.
3. Add intermediate paths for Jain epistemology, vows and household life, scripture and manuscript transmission, sacred places, festivals, and contemporary Jain communities as source coverage and reviewers allow.
4. Gather corrections from readers and teachers, record what changed, then revise the lesson and its source record together.

This sequence builds on the existing editorial playbook. It does not mark any topic as reviewed or treat the source notes as a substitute for community review.
