# Learn About Jainism

A learning library for exploring Jain ideas, texts, communities, and practices. English remains the article language; Gujarati and Hindi reading views cover the main learning pages and clearly identify untranslated articles.

## Editorial status

The catalogue is broader than its reviewed content. At the current baseline, it contains 52 subject areas and 1,676 indexed topics. Existing topic summaries and other JSON datasets are drafts; the site marks them as such. No topic currently meets the project's complete review-record standard. See [the editorial playbook](docs/CONTENT_EDITORIAL_PLAYBOOK.md) for the workflow and [the current audit](docs/CURRENT_DESIGN_AND_VOICE_AUDIT.md) for known gaps.

## Run locally

Use Node.js 22 (minimum supported by Next.js: 20.9) and npm:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000/en>, <http://localhost:3000/hi>, or <http://localhost:3000/gu>. The home page, reading paths, catalogue controls, editorial method, and practice overview have draft Gujarati and Hindi translations. The 1,676 topic articles remain in English; the language selector explains this and offers the English article. Gujarati and Hindi pages are marked `noindex` until fluent readers review the translations. The production root `/` redirects to `/en` through Cloudflare Pages configuration.

## Project commands

```sh
npm run dev                 # local development server
npm run lint                # ESLint
npm run content:audit       # ontology coverage, citation fields, and review queue
npm run content:audit -- --csv docs/content-review-queue.csv
npm run content:audit -- --csv docs/content-review-queue.csv --datasets-csv docs/dataset-review-queue.csv
npm run content:voice-audit # phrase-pattern queue for human editing
npm run build               # production build
npm start                    # serve a production build
```

The automated audits check structure and flag potential review priorities. Voice-pattern matches point editors to generic contrasts, superlatives, and other phrases that may sound formulaic. They do not establish AI authorship, check facts, or replace qualified human review. Do not mark a page reviewed just to clear a check.

## Project map

- `src/app/[locale]` — localized routes, landing pages, topic catalogue, and practice section.
- `src/components` — navigation, catalogue search, editorial status notices, and reading components.
- `src/data/ontology.json` — the topic index.
- `src/data/topics` — topic draft records keyed by stable catalogue ID.
- `src/data/*.json` — supplemental catalogs and study datasets; review them using the process in the playbook.
- `scripts/audit-content.mjs` — coverage, safety, and writing-style review queues.
- `docs/content-voice-review-queue.csv` — current phrase-pattern candidates for human editing.
- `docs/CONTENT_EDITORIAL_PLAYBOOK.md` — standards, review schema, and sequencing plan.
- `docs/LAUNCH_CHECKLIST.md` — hosting and domain steps before public launch.
- `docs/HOSTING_AND_STUDY_GUIDE_PLAN.md` — Cloudflare Pages feasibility and study-note-derived learning paths.

## Launch

The site is live on Cloudflare Pages at [learnaboutjainism.com](https://learnaboutjainism.com/). Each change merged to `main` deploys through the connected GitHub integration. See [the hosting and study guide plan](docs/HOSTING_AND_STUDY_GUIDE_PLAN.md) and [the launch checklist](docs/LAUNCH_CHECKLIST.md) for limits and release checks.
