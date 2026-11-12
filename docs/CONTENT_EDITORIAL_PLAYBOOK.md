# Content Editorial Playbook

**Baseline:** 2026-11-11<br>
**Scope:** the ontology, topic files, practice pages, and any future translated editions.

## Current coverage

- The catalogue has 52 subject areas and 1,676 topic records.
- 1,489 topic records have a JSON draft; 187 are indexed but have no article file.
- None of the 1,489 draft files has a complete editorial review record.
- The existing topic files contain 5,143 records under `primary_sources`. None currently has a URL, edition, or pinpoint location, so none can be verified from the repository alone.
- The baseline keyword scan flagged 949 topic entries and 23 of 26 supplemental JSON datasets for human triage. A keyword match is a review prompt, not a finding that content is wrong.
- The previous learning-path data included age-based schedules, invented resource lists, and fasting-related activities. The public reading paths now use topic links and do not prescribe practice.

Run the inventory with:

```sh
npm run content:audit
npm run content:audit -- --csv docs/content-review-queue.csv
npm run content:audit -- --csv docs/content-review-queue.csv --datasets-csv docs/dataset-review-queue.csv
```

The audit checks ontology structure, entry-file coverage, review records, and legacy citation fields. Its topic keyword scan covers overviews and misconception text; the supplemental scan checks every JSON file directly in `src/data` except the ontology and learning paths. Both scans prioritize material for human review and can produce false positives. They cannot establish that a claim, quotation, or practice description is accurate.

## Review record

Keep each entry in `src/data/topics/<topic_id>.json`. Add a record only after a human has checked the article against the cited material:

```json
{
  "editorial_review": {
    "status": "reviewed",
    "reviewed_on": "YYYY-MM-DD",
    "reviewed_by": "Reviewer name",
    "reviewer_qualification": "Relevant tradition, language, or research experience",
    "sources": [
      {
        "title": "Full source title",
        "url": "https://example.org/source",
        "source_type": "primary text",
        "tradition": "Specify when relevant",
        "edition": "Edition or publication details",
        "translator": "Translator, if applicable",
        "locator": "Chapter, verse, page, or section"
      }
    ]
  }
}
```

Every source shown as reviewed must have a working HTTPS link, source type, and exact locator. Primary texts should identify the edition and translator where applicable. Do not mark a page reviewed because it has a bibliography, a generated source list, or a second model's approval.

The app hides legacy quotation blocks and misconception lists until a complete review record exists. Practice pages without a recorded source review show a status page instead of publishing their unverified translations or ritual explanations. `ScriptureReader` also withholds text until its caller supplies the source, edition, locator, reviewer, and review date.

## A repeatable review pass

1. Choose a bounded batch of 15–25 topics and record its owner and target date in the review queue.
2. Check the ontology title and any existing claims against primary texts, reviewed traditional commentary, academic scholarship, and community education. Keep those source types distinct.
3. Verify every quotation against a named edition and location. Compare translations where meaning or terminology is disputed.
4. Separate a community's own account from historical reconstruction. Name the relevant Jain tradition when claims differ; state uncertainty where evidence is incomplete.
5. Ask a qualified human familiar with the relevant language, text, or community to review the draft. Use a second reviewer for sectarian disputes, health-related practice, end-of-life vows, or material for children.
6. Add the review record, run `npm run content:audit`, and inspect the generated CSV for missing entries and safety-sensitive topics.
7. Publish a batch only after its source and review fields are complete. Keep all remaining entries clearly marked as drafts.

## Recommended order

| Pass | Coverage | Completion condition |
| --- | --- | --- |
| 1. Orientation | What Jainism is, key terms, shared foundations, diversity, historical method | Beginner pages distinguish tradition claims from historical evidence and identify important differences. |
| 2. Core concepts | Soul, karma, liberation, the tattvas, knowledge, and non-violence | Key terms have source locators, tradition notes, and checked transliteration. |
| 3. Texts and transmission | Āgamas, Tattvārthasūtra, major Digambara and Śvetāmbara works, manuscript history | Each tradition's canon and interpretive lineage is described on its own terms. |
| 4. Living practice | Vows, festivals, prayer, fasting, monastic life, end-of-life vows | Qualified human review; no medical, coercive, or prescriptive claims are published as general advice. |
| 5. Remaining catalogue | Work domain by domain using the CSV queue | Every catalogue item is either a sourced reviewed article or visibly marked as awaiting a draft. |
| 6. Language editions | Gujarati and Hindi interface and article translations | Translation is checked by a fluent human, with diacritics, scripts, and terminology reviewed. |

## Editorial rules

- Attribute statements: “Śvetāmbara sources describe…” or “Jainpedia summarizes…” is more precise than a blanket “Jainism says…”.
- Keep devotional language, a text's own claims, and academic conclusions distinct.
- Avoid unsupported superlatives, fixed dates for contested lives, invented statistics, and claims that Jain teachings are scientifically proved.
- Do not turn fasting, monastic discipline, or end-of-life vows into steps, targets, challenges, or recommendations. Refer personal religious questions to qualified Jain teachers and health questions to clinicians.
- Do not publish fabricated quotations, approximate translations presented as canonical, or resource lists that have not been checked.
- Treat Gujarati and Hindi routes as unready for a language claim until the page content—not just navigation labels—has been translated and reviewed.

## Useful starting references

- [Encyclopaedia Britannica: Jainism](https://www.britannica.com/topic/Jainism) — general secondary orientation.
- [Jainpedia: Śvetāmbara canon](https://jainpedia.org/article/themes/principles/sacred-writings/svetambara-canon/) — tradition-focused account of textual transmission.
- [Fujinaga Sin, “Śvetāmbara Canons in the Digambara Tradition”](https://jainastudies.soas.ac.uk/ijjs/ijjs-0305-2007.pdf), *International Journal of Jaina Studies* 3.5 (2007) — one scholarly argument, not a universal consensus.
- [Jainpedia: Festivals](https://jainpedia.org/article/themes/practices/festivals/) — community variation and calendar context.
- [Parliament of the World’s Religions: Paryushan and Das Lakshana](https://parliamentofreligions.org/articles/introspection-and-forgiveness-the-jain-celebration-of-paryushan-and-das-lakshan/) — community-facing overview; verify local observance separately.
