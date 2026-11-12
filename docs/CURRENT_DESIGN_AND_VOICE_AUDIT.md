# Product and content audit

**Baseline reviewed:** 2026-11-11<br>
**Purpose:** set a practical path from prototype to a reliable, accessible learning library.

## What changed in this pass

- Replaced the generic landing page with a clear entry point, three reading sequences, a searchable catalogue, and visible links to the editorial method.
- Grouped catalogue browsing and added search so visitors do not have to load and scan all 1,676 topics at once.
- Removed internal catalogue codes from the primary browsing experience; retained stable IDs in URLs and source data.
- Added draft notices to topic summaries and practice material. Topic quotations and misconception lists are withheld until a review record contains linked sources and pinpoint locations.
- Added an editorial coverage page, content audit command, and a review playbook.
- Replaced the unconfigured Prisma-backed karma API with a static response clearly marked unreviewed; validated file names on the generic data endpoint.
- Updated the application runtime to a maintained Next.js release and added a continuous integration workflow.

## Current content condition

The ontology is a useful index, not a complete body of reviewed articles. At this baseline it has 52 subject areas and 1,676 topics; 1,489 have a draft JSON file, 187 do not yet have one, and none has a complete human editorial review record. Its 5,143 legacy source objects have no URL, edition, or pinpoint locator. See [the editorial playbook](CONTENT_EDITORIAL_PLAYBOOK.md) and run `npm run content:audit` for the current inventory.

Beyond the topic files, `src/data` contains separate glossaries, biographies, histories, practice datasets, festival descriptions, chant catalogues, and reading lists. They include universalizing language, disputed claims, and health or efficacy claims that need review. The audit script now flags risk terms in those files for human triage; it does not fact-check them.

## Remaining product work

1. **Editorial trust:** review material in small, owned batches; distinguish textual claims, community practice, and historical scholarship; add edition-level citations and qualified human review.
2. **Coverage:** prioritize orientation and foundational concepts, then texts and transmission, traditions and communities, ethics, and carefully reviewed practice. Keep missing entries visible as work in progress.
3. **Accessibility:** verify keyboard behavior, screen-reader labels, contrast, zoom, reduced motion, and mobile layouts against the running site. Search and all navigation need a keyboard-only pass.
4. **Information architecture:** replace broad catalog groupings with topic clusters and related-entry links after core entries are reviewed. Add a bibliography and source-type filters when the source records are reliable.
5. **Language:** routes currently exist for `en`, `hi`, and `gu`, but page content is English. Do not describe Hindi or Gujarati as available editions until content and interface strings are translated and reviewed by fluent readers.
6. **Operations:** configure a production host, domain DNS, deploy previews, and monitoring. This repository has no deployment configuration or credentials; see [the launch checklist](LAUNCH_CHECKLIST.md).

## Design direction

Keep the warm paper palette, legible serif reading type, restrained headings, and spacious layouts. Improve the product through clarity and provenance rather than decorative effects. The next visual pass should test real phone widths, long Indic transliterations, large text settings, and high-contrast modes, then document the results with screenshots.

## Editorial voice

Prefer specific attribution such as “Śvetāmbara sources describe…” or “this community guide presents…” over “Jainism says…”. Avoid unqualified superlatives, fabricated quotations, universal claims about all Jains, claims that religious practice cures illness, and instructions for fasting or end-of-life vows. Name uncertainty and variation plainly.
