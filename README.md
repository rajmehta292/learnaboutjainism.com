# Learn About Jainism

An English-language learning library for exploring Jain ideas, texts, communities, and practices. The site is being rebuilt around clear editorial status, better navigation, and source-level review.

## Editorial status

The catalogue is broader than its reviewed content. At the current baseline, it contains 52 subject areas and 1,676 indexed topics. Existing topic summaries and other JSON datasets are drafts; the site marks them as such. No topic currently meets the project's complete review-record standard. See [the editorial playbook](docs/CONTENT_EDITORIAL_PLAYBOOK.md) for the workflow and [the current audit](docs/CURRENT_DESIGN_AND_VOICE_AUDIT.md) for known gaps.

## Run locally

Use Node.js 22 (minimum supported by Next.js: 20.9) and npm:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000/en>. The public build currently contains the English edition only; Hindi and Gujarati routes will be enabled when their content is translated and reviewed. The production root `/` redirects to `/en` through Cloudflare Pages configuration.

## Project commands

```sh
npm run dev                 # local development server
npm run lint                # ESLint
npm run content:audit       # ontology coverage, citation fields, and review queue
npm run content:audit -- --csv docs/content-review-queue.csv
npm run content:audit -- --csv docs/content-review-queue.csv --datasets-csv docs/dataset-review-queue.csv
npm run build               # production build
npm start                    # serve a production build
```

The automated audit checks structure and highlights possible review priorities. It cannot verify a quotation, establish doctrinal consensus, or replace qualified human review. Do not mark a page reviewed just to clear a check.

## Project map

- `src/app/[locale]` — localized routes, landing pages, topic catalogue, and practice section.
- `src/components` — navigation, catalogue search, editorial status notices, and reading components.
- `src/data/ontology.json` — the topic index.
- `src/data/topics` — topic draft records keyed by stable catalogue ID.
- `src/data/*.json` — supplemental catalogs and study datasets; review them using the process in the playbook.
- `scripts/audit-content.mjs` — coverage report and CSV queues for editorial work.
- `docs/CONTENT_EDITORIAL_PLAYBOOK.md` — standards, review schema, and sequencing plan.
- `docs/LAUNCH_CHECKLIST.md` — hosting and domain steps before public launch.
- `docs/HOSTING_AND_STUDY_GUIDE_PLAN.md` — Cloudflare Pages feasibility and study-note-derived learning paths.

## Launch

Cloudflare Pages Free is the recommended target. The static export is configured and verified locally at 8,520 files; the Pages preview and custom domain are not configured yet. See [the hosting and study guide plan](docs/HOSTING_AND_STUDY_GUIDE_PLAN.md) and [the launch checklist](docs/LAUNCH_CHECKLIST.md) before a public launch.
