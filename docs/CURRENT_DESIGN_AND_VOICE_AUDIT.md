# Product and content audit

**Baseline reviewed:** 2026-11-14<br>
**Purpose:** set a practical path from prototype to a reliable, accessible learning library.

## What changed in this pass

- Replaced the generic landing page with a clear entry point, six reading paths, a searchable catalogue, and visible links to the editorial method.
- Grouped catalogue browsing and added search so visitors do not have to load and scan all 1,676 topics at once.
- Removed internal catalogue codes from the primary browsing experience; retained stable IDs in URLs and source data.
- Added draft notices to topic summaries and practice material. Topic quotations and misconception lists are withheld until a review record contains linked sources and pinpoint locations.
- Added an editorial coverage page, content audit command, and a review playbook.
- Replaced the unconfigured Prisma-backed karma API with a static response clearly marked unreviewed; validated file names on the generic data endpoint.
- Updated the application runtime to a maintained Next.js release and added a continuous integration workflow.
- Added a header language selector and draft Gujarati and Hindi reading views for the home page, reading paths, catalogue controls and subject names, editorial method, and practice index.
- Made the HTML language, search/filter copy, shared navigation, and footer follow the selected locale. Topic articles remain English and open from localized views with that status explained.
- Kept Gujarati and Hindi pages out of search results until fluent readers review the translations. Added a language fallback page for English topic articles.
- Rewrote abstract home-page slogans and added a phrase-pattern review queue for likely boilerplate across topic files and supplemental datasets.

## Current content condition

The ontology is a useful index, not a complete body of reviewed articles. At this baseline it has 52 subject areas and 1,676 topics; 1,489 have a draft JSON file, 187 do not yet have one, and none has a complete human editorial review record. Its 5,143 legacy source objects have no URL, edition, or pinpoint locator. See [the editorial playbook](CONTENT_EDITORIAL_PLAYBOOK.md) and run `npm run content:audit` for the current inventory.

Beyond the topic files, `src/data` contains separate glossaries, biographies, histories, practice datasets, festival descriptions, chant catalogues, and reading lists. They include universalizing language, disputed claims, and health or efficacy claims that need review. The audit script now flags risk terms in those files for human triage; it does not fact-check them.

## Remaining product work

1. **Editorial trust:** review material in small, owned batches; distinguish textual claims, community practice, and historical scholarship; add edition-level citations and qualified human review.
2. **Coverage:** prioritize orientation and foundational concepts, then texts and transmission, traditions and communities, ethics, and carefully reviewed practice. Keep missing entries visible as work in progress.
3. **Accessibility:** verify keyboard behavior, screen-reader labels, contrast, zoom, reduced motion, and mobile layouts against the running site. Search and all navigation need a keyboard-only pass.
4. **Information architecture:** replace broad catalog groupings with topic clusters and related-entry links after core entries are reviewed. Add a bibliography and source-type filters when the source records are reliable.
5. **Language:** the main learning pages have draft Gujarati and Hindi translations; the 1,676 topic articles remain English. Ask fluent readers to review the interface and Jain terms, then translate articles in sourced, reviewed batches. Keep all unreviewed translations out of search results.
6. **Operations:** keep Cloudflare's GitHub deployment, domain validation, and uptime checks healthy; watch build limits as translated routes grow. See [the launch checklist](LAUNCH_CHECKLIST.md).

## Design direction

Keep the warm paper palette, legible serif reading type, restrained headings, and spacious layouts. Improve the product through clarity and provenance rather than decorative effects. The next visual pass should test real phone widths, long Indic transliterations, large text settings, and high-contrast modes, then document the results with screenshots.

## Copy changes and editorial voice

The landing page previously used broad promotional lines such as “A careful beginning to a living tradition” and “Depth comes from careful reading, not from a longer list.” The revised copy says what a reader can do and what each page still needs: “Start with a question you have” and “Each article needs a source and a reviewer.” The social preview now uses “An introduction to Jain traditions” and “Read a topic. Check its sources.”

The short statement below is drafted in Gujarati first, then Hindi, then English. It captures the editorial point without claiming the articles have been reviewed:

| Gujarati | हिन्दी | English |
| --- | --- | --- |
| દરેક લેખ માટે ચોક્કસ સ્ત્રોત અને સમીક્ષા જરૂરી છે. | हर लेख के लिए स्रोत और समीक्षा ज़रूरी है। | Each article needs a source and a reviewer. |

The current voice queue names matching JSON files and fields. Review candidates for clear attribution, useful examples, specific dates and editions, and a natural sentence rhythm. Rewrite after checking the claim; do not remove nuance or uncertainty just to make prose shorter.

Prefer direct verbs and concrete details. Remove promotional adjectives, empty transitions, repeated summaries, and contrasts that add no factual meaning. Use “a Śvetāmbara commentary says…” or “this community’s guide describes…” when a claim belongs to a specific source. A phrase match is only a human-editing cue; it is not proof that text was AI-generated.

Prefer specific attribution such as “Śvetāmbara sources describe…” or “this community guide presents…” over “Jainism says…”. Avoid unqualified superlatives, fabricated quotations, universal claims about all Jains, claims that religious practice cures illness, and instructions for fasting or end-of-life vows. Name uncertainty and variation plainly.
