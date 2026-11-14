"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import type { SiteCopy } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

export type LibraryTopic = { id: string; title: string; hasEntry: boolean };
export type LibraryGroup = keyof SiteCopy["Library"]["groups"];
export type LibraryDomain = {
  id: string;
  title: string;
  originalTitle: string;
  groupKey: LibraryGroup;
  topics: LibraryTopic[];
};

const GROUPS: LibraryGroup[] = ["all", "foundations", "ethics", "history", "texts", "arts", "research"];
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();

export default function LibraryExplorer({
  domains,
  copy,
  locale,
}: {
  domains: LibraryDomain[];
  copy: SiteCopy["Library"];
  locale: SiteLocale;
}) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<LibraryGroup>("all");
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [resultLimit, setResultLimit] = useState(40);
  const numberLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-US";
  const visibleDomains = domains.filter((domain) => activeGroup === "all" || domain.groupKey === activeGroup);
  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId);
  const results = useMemo(() => {
    const search = normalize(query.trim());
    if (!search) return [];

    return domains
      .filter((domain) => activeGroup === "all" || domain.groupKey === activeGroup)
      .flatMap((domain) => domain.topics
        .filter((topic) => normalize(`${topic.title} ${domain.title} ${domain.originalTitle}`).includes(search))
        .map((topic) => ({ ...topic, domainTitle: domain.title })));
  }, [activeGroup, domains, query]);

  function changeGroup(group: LibraryGroup) {
    setActiveGroup(group);
    setSelectedDomainId(null);
    setResultLimit(40);
  }

  function changeQuery(value: string) {
    setQuery(value);
    setSelectedDomainId(null);
    setResultLimit(40);
  }

  function topicHref(topicId: string) {
    return locale === "en" ? `/ontology/${topicId}` : `/en/ontology/${topicId}`;
  }

  function entryLabel(hasEntry: boolean) {
    return locale === "en" ? (hasEntry ? "Draft entry" : "Entry in progress") : (hasEntry ? copy.draftEntry : copy.entryProgress);
  }

  return (
    <div className="library-explorer">
      <form className="library-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="library-search-input">{copy.searchLabel}</label>
        <div className="library-search__row">
          <input
            id="library-search-input"
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
          />
          {query && <button className="text-button" type="button" onClick={() => changeQuery("")}>{copy.clear}</button>}
        </div>
        <p>{copy.searchHelp}</p>
      </form>

      <div className="library-filters" role="group" aria-label={copy.filterLabel}>
        {GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            className={`filter-chip${activeGroup === group ? " is-active" : ""}`}
            aria-pressed={activeGroup === group}
            onClick={() => changeGroup(group)}
          >
            {copy.groups[group]}
          </button>
        ))}
      </div>

      {query.trim() ? (
        <section className="library-results" aria-live="polite" aria-labelledby="library-results-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">{copy.searchEyebrow}</p>
              <h2 id="library-results-title">{results.length.toLocaleString(numberLocale)} {results.length === 1 ? copy.resultOne : copy.resultMany}</h2>
            </div>
          </div>
          {results.length > 0 ? (
            <>
              <ul className="topic-results">
                {results.slice(0, resultLimit).map((topic) => (
                  <li key={topic.id}>
                    <Link href={topicHref(topic.id)} className="topic-result">
                      <span>{topic.title}</span>
                      <span className="topic-result__meta">{topic.domainTitle} · {entryLabel(topic.hasEntry)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {results.length > resultLimit && (
                <button className="button button--quiet" type="button" onClick={() => setResultLimit((limit) => limit + 40)}>{copy.showMore}</button>
              )}
            </>
          ) : (
            <div className="empty-state"><h3>{copy.emptyTitle}</h3><p>{copy.emptyDescription}</p></div>
          )}
        </section>
      ) : selectedDomain ? (
        <section className="selected-domain" aria-labelledby="selected-domain-title">
          <div className="selected-domain__heading">
            <div>
              <p className="eyebrow">{copy.groups[selectedDomain.groupKey]}</p>
              <h2 id="selected-domain-title">{selectedDomain.title}</h2>
              <p>{selectedDomain.topics.length.toLocaleString(numberLocale)} {copy.topics}. {copy.topicEntriesNote}</p>
            </div>
            <button className="text-button" type="button" onClick={() => setSelectedDomainId(null)}>{copy.backToSubjects}</button>
          </div>
          <ul className="topic-results topic-results--domain">
            {selectedDomain.topics.map((topic) => (
              <li key={topic.id}>
                <Link href={topicHref(topic.id)} className="topic-result">
                  <span>{topic.title}</span>
                  <span className="topic-result__meta">{entryLabel(topic.hasEntry)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="domain-list-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">{copy.browseBySubject}</p>
              <h2 id="domain-list-title">{copy.chooseSubject}</h2>
            </div>
            <p className="section-heading__note">{visibleDomains.length.toLocaleString(numberLocale)} {copy.subjectCount}</p>
          </div>
          <div className="domain-grid">
            {visibleDomains.map((domain) => (
              <button
                key={domain.id}
                className="domain-card"
                type="button"
                onClick={() => setSelectedDomainId(domain.id)}
                aria-label={`${domain.title}, ${domain.topics.length} ${copy.topics}`}
              >
                <span className="domain-card__count">{String(domain.topics.length).padStart(2, "0")} {copy.topics}</span>
                <span className="domain-card__title">{domain.title}</span>
                <span className="domain-card__action">{copy.openSubject} <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
