# Product and content audit

**Baseline reviewed:** 2026-11-15<br>
**Purpose:** set a practical path from prototype to a reliable, accessible learning library.

## What changed in this pass

- Replaced the generic landing page with a clear entry point, six reading paths, a searchable catalogue, and visible links to the editorial method.
- Grouped catalogue browsing and added search so visitors do not have to load and scan all 1,401 topics at once.
- Removed internal catalogue codes from the primary browsing experience; retained stable IDs in URLs and source data.
- Added simple verification labels to topic summaries and practice material. Unreviewed topic source lists and question sections are withheld until a complete review record exists.
- Added canonical metadata to the privacy page, aligned the sitemap audit with that public route, and added a check that catches unreviewed source-list leakage.
- Added an editorial coverage page, content audit command, and a review playbook.
- Replaced the unconfigured Prisma-backed karma API with a static response clearly marked unreviewed; validated file names on the generic data endpoint.
- Updated the application runtime to a maintained Next.js release and added a continuous integration workflow.
- Added a header language selector and draft Gujarati and Hindi reading views for the home page, reading paths, catalogue controls and subject names, editorial method, and practice index.
- Made the HTML language, search/filter copy, shared navigation, and footer follow the selected locale. Topic articles remain English and open from localized views with that status explained.
- Kept Gujarati and Hindi pages out of search results until fluent readers review the translations. Added a language fallback page for English topic articles.
- Rewrote abstract home-page slogans and added a phrase-pattern review queue for likely boilerplate across topic files and supplemental datasets.
- Replaced the homepage's numbered concept list with a linked four-topic reading map in English, Hindi, and Gujarati; it explicitly avoids implying a fixed spiritual sequence.
- Added a librarian dashboard summary for drafts and incoming reports, a searchable feedback inbox with assignments and history, and a documented review workflow page.
- Replaced the account-gated GitHub footer link with a translated, no-account report form. Live reports are designed to enter both the private D1 inbox and the public GitHub tracker; the Pages secret and D1 migration still need deployment setup.

## Current content condition

The catalogue has 50 subject areas and 1,401 topics. All listed topics have a JSON file, but none has a complete human editorial review record. The files also contain 88 topics outside the catalogue; reconcile those intentionally. Across the listed articles, 4,873 legacy source records lack a complete URL, edition, and exact location. The content audit flags 890 topic entries and 23 of 26 supplemental datasets for human triage. Its voice scan marks 1,399 text fields across 896 entries for a human tone review; those are pattern cues, not proof of AI authorship. See [the editorial playbook](CONTENT_EDITORIAL_PLAYBOOK.md) for the current inventory and review process.

Beyond the topic files, `src/data` contains separate glossaries, biographies, histories, practice datasets, festival descriptions, chant catalogues, and reading lists. They include universalizing language, disputed claims, and health or efficacy claims that need review. The audit script now flags risk terms in those files for human triage; it does not fact-check them.

## Remaining product work

1. **Editorial trust and workload:** assign a named owner and target date to bounded review batches; prioritize the beginner path and safety-sensitive material; record source edition, locator, tradition, and qualified reviewer in the same workflow. The current queue has no complete human reviews.
2. **Article readability:** add meaningful subheadings, summaries, definitions, and cross-links to long entries. The current overview has a median of about 346 words, a 90th percentile of 740, and a maximum of 1,088; its paragraph-first rendering can make longer pages difficult to scan.
3. **Teaching visuals:** add a few source-reviewed diagrams where a picture explains more than another paragraph: the Jain cosmos, soul and karma, the Three Jewels, and differences among vows. Give every visual a useful text equivalent and alt text; distinguish traditional cosmology from modern astronomy.
4. **Search and discovery:** extend search beyond English title/domain substring matches to aliases, transliteration, and article text. Add spelling variants and useful related topics, while keeping results understandable to new learners.
5. **Accessibility and responsive behavior:** manually review narrow phones, landscape, tablet, desktop, 200% zoom, keyboard-only use, focus visibility, screen readers, contrast, and reduced motion. Automated link and metadata checks do not replace this review.
6. **Language:** the main learning pages have draft Gujarati and Hindi translations; the 1,401 topic articles remain English. Have fluent readers review the interface and Jain terms, then translate sourced articles in reviewed batches.
7. **Reader tools and account readiness:** improve saved-reading and notes flows with path progress, clear empty states, editing, export, and protection against losing an unsaved note. The no-account feedback flow still needs its D1 migration and GitHub secret configured before it works on production. Confirm OAuth settings and D1 bindings in Preview and Production and exercise sign-in, note privacy, sign-out, and account deletion.
8. **Editorial workspace:** the dashboard now shows review counts, drafts, reports, assignments, recent activity, and workflow instructions. Continue by reconciling the 88 unlisted files, adding a second-review state if the library adopts mandatory independent review, and recording bounded work batches with owners and due dates.
9. **Publishing and performance:** keep Cloudflare's GitHub deployment and uptime checks healthy; measure page-level transfer size and Core Web Vitals in a real browser, then investigate the large generated text payloads and watch the file count as locale coverage grows. See [the launch checklist](LAUNCH_CHECKLIST.md).

## Design direction

Keep the warm paper palette, legible serif reading type, restrained headings, and spacious layouts. The homepage now links its four main concepts in a compact map. Add factual diagrams only after sources and reviewers are in place. The latest static export has no inline images and is 481.44 MiB raw, mostly generated route payloads; that total alone does not show what a reader downloads for one page. No browser performance trace was available during this audit, so page-level LCP, CLS, and transfer size remain unmeasured. Test real phone widths, long Indic transliterations, large text settings, high-contrast modes, and network-throttled loading, then document results with screenshots and measurements.

## Copy changes and editorial voice

The landing page previously used broad promotional lines such as “A careful beginning to a living tradition.” The current hero is more directly about Jain teachings: “Jainism: the soul, karma, and liberation.” Keep future copy concrete: name a Jain topic, explain what the page covers, and avoid promotional or abstract slogans.

The short statement below is drafted in Gujarati first, then Hindi, then English. It captures the editorial point without claiming the articles have been reviewed:

| Gujarati | हिन्दी | English |
| --- | --- | --- |
| દરેક લેખ માટે ચોક્કસ સ્ત્રોત અને સમીક્ષા જરૂરી છે. | हर लेख के लिए स्रोत और समीक्षा ज़रूरी है। | Each article needs a source and a reviewer. |

The current voice queue names matching JSON files and fields. Review candidates for clear attribution, useful examples, specific dates and editions, and a natural sentence rhythm. Rewrite after checking the claim; do not remove nuance or uncertainty just to make prose shorter.

Prefer direct verbs and concrete details. Remove promotional adjectives, empty transitions, repeated summaries, and contrasts that add no factual meaning. Use “a Śvetāmbara commentary says…” or “this community’s guide describes…” when a claim belongs to a specific source. A phrase match is only a human-editing cue; it is not proof that text was AI-generated.

Prefer specific attribution such as “Śvetāmbara sources describe…” or “this community guide presents…” over “Jainism says…”. Avoid unqualified superlatives, fabricated quotations, universal claims about all Jains, claims that religious practice cures illness, and instructions for fasting or end-of-life vows. Name uncertainty and variation plainly.
