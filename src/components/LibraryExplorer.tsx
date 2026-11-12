"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";

export type LibraryTopic = {
  id: string;
  title: string;
  hasEntry: boolean;
};

export type LibraryDomain = {
  id: string;
  title: string;
  group: string;
  topics: LibraryTopic[];
};

const GROUPS = [
  "All subjects",
  "Foundations & philosophy",
  "Ethics & practice",
  "History & community",
  "Texts & literature",
  "Arts & culture",
  "Research & reference",
];

const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();

export default function LibraryExplorer({ domains }: { domains: LibraryDomain[] }) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [resultLimit, setResultLimit] = useState(40);

  const visibleDomains = domains.filter(
    (domain) => activeGroup === GROUPS[0] || domain.group === activeGroup,
  );
  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId);
  const results = useMemo(() => {
    const search = normalize(query.trim());
    if (!search) return [];

    return domains
      .filter((domain) => activeGroup === GROUPS[0] || domain.group === activeGroup)
      .flatMap((domain) =>
        domain.topics
          .filter((topic) => normalize(`${topic.title} ${domain.title}`).includes(search))
          .map((topic) => ({ ...topic, domainTitle: domain.title })),
      );
  }, [activeGroup, domains, query]);

  function changeGroup(group: string) {
    setActiveGroup(group);
    setSelectedDomainId(null);
    setResultLimit(40);
  }

  function changeQuery(value: string) {
    setQuery(value);
    setSelectedDomainId(null);
    setResultLimit(40);
  }

  return (
    <div className="library-explorer">
      <form className="library-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="library-search-input">Search the topic catalogue</label>
        <div className="library-search__row">
          <input
            id="library-search-input"
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Try ahimsa, karma, scripture, or a tradition"
            autoComplete="off"
          />
          {query && (
            <button className="text-button" type="button" onClick={() => changeQuery("")}>Clear</button>
          )}
        </div>
        <p>Search topic and subject-area titles. Diacritics are optional.</p>
      </form>

      <div className="library-filters" role="group" aria-label="Filter by subject area">
        {GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            className={`filter-chip${activeGroup === group ? " is-active" : ""}`}
            aria-pressed={activeGroup === group}
            onClick={() => changeGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>

      {query.trim() ? (
        <section className="library-results" aria-live="polite" aria-labelledby="library-results-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">Catalogue search</p>
              <h2 id="library-results-title">{results.length} {results.length === 1 ? "result" : "results"}</h2>
            </div>
          </div>
          {results.length > 0 ? (
            <>
              <ul className="topic-results">
                {results.slice(0, resultLimit).map((topic) => (
                  <li key={topic.id}>
                    <Link href={`/ontology/${topic.id}`} className="topic-result">
                      <span>{topic.title}</span>
                      <span className="topic-result__meta">
                        {topic.domainTitle} · {topic.hasEntry ? "Draft entry" : "Entry in progress"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {results.length > resultLimit && (
                <button className="button button--quiet" type="button" onClick={() => setResultLimit((limit) => limit + 40)}>
                  Show more results
                </button>
              )}
            </>
          ) : (
            <p className="empty-state">No topic titles match that search. Try a broader term or choose another subject area.</p>
          )}
        </section>
      ) : selectedDomain ? (
        <section className="selected-domain" aria-labelledby="selected-domain-title">
          <div className="selected-domain__heading">
            <div>
              <p className="eyebrow">{selectedDomain.group}</p>
              <h2 id="selected-domain-title">{selectedDomain.title}</h2>
              <p>{selectedDomain.topics.length} catalogue topics. Entries marked as drafts have not received item-by-item editorial review.</p>
            </div>
            <button className="text-button" type="button" onClick={() => setSelectedDomainId(null)}>
              Back to subject areas
            </button>
          </div>
          <ul className="topic-results topic-results--domain">
            {selectedDomain.topics.map((topic) => (
              <li key={topic.id}>
                <Link href={`/ontology/${topic.id}`} className="topic-result">
                  <span>{topic.title}</span>
                  <span className="topic-result__meta">{topic.hasEntry ? "Draft entry" : "Entry in progress"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="domain-list-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">Browse by subject</p>
              <h2 id="domain-list-title">Choose an area to explore</h2>
            </div>
            <p className="section-heading__note">{visibleDomains.length} subject areas</p>
          </div>
          <div className="domain-grid">
            {visibleDomains.map((domain) => (
              <button
                key={domain.id}
                className="domain-card"
                type="button"
                onClick={() => setSelectedDomainId(domain.id)}
                aria-label={`${domain.title}, ${domain.topics.length} topics`}
              >
                <span className="domain-card__count">{String(domain.topics.length).padStart(2, "0")} topics</span>
                <span className="domain-card__title">{domain.title}</span>
                <span className="domain-card__action">Open subject <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
