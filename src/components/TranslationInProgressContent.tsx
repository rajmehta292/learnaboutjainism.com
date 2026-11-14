"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/routing";
import type { SiteCopy } from "@/i18n/messages";

const sourcePattern = /^\/(ontology\/D\d{2}\.T\d{3}|aradhana\/[a-z0-9-]+)\/?$/;

function getSafeSource(value: string | null | undefined) {
  return value && sourcePattern.test(value) ? value : null;
}

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export default function TranslationInProgressContent({
  copy,
  initialSource,
}: {
  copy: SiteCopy["Pending"];
  initialSource?: string;
}) {
  const source = useSyncExternalStore(
    subscribeToHistory,
    () => getSafeSource(new URLSearchParams(window.location.search).get("source")) ?? getSafeSource(initialSource),
    () => getSafeSource(initialSource),
  );

  return (
    <main id="main-content" className="translation-pending">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      <div className="button-row">
        {source && <a className="button button--primary" href={`/en${source}`}>{copy.englishLink}</a>}
        <Link className="button button--outline" href="/">{copy.homeLink}</Link>
      </div>
      <p className="translation-pending__note">{copy.note}</p>
    </main>
  );
}
