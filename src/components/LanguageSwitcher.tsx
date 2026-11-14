"use client";

import { useRouter } from "next/navigation";
import { useSiteLocale } from "@/i18n/LocaleProvider";
import type { SiteCopy } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";

const localeCodes = new Set<SiteLocale>(["en", "hi", "gu"]);

export default function LanguageSwitcher({ copy }: { copy: SiteCopy["Navigation"] }) {
  const locale = useSiteLocale();
  const router = useRouter();

  function changeLanguage(value: string) {
    if (!localeCodes.has(value as SiteLocale)) return;
    const nextLocale = value as SiteLocale;
    const currentPath = window.location.pathname;
    const currentSearch = new URLSearchParams(window.location.search);
    const isPendingPage = currentPath.endsWith("/translation-in-progress");
    const source = currentSearch.get("source");
    const safeSource = source && /^\/(ontology\/D\d{2}\.T\d{3}|aradhana\/[a-z0-9-]+)\/?$/.test(source)
      ? source
      : null;

    if (isPendingPage && safeSource && nextLocale === "en") {
      router.push(`/en${safeSource}`);
      return;
    }

    const withoutLocale = currentPath.replace(/^\/(en|hi|gu)(?=\/|$)/, "") || "/";
    const isTopicArticle = /^\/ontology\/D\d{2}\.T\d{3}\/?$/.test(withoutLocale);

    if (isTopicArticle && nextLocale !== "en") {
      const query = new URLSearchParams({ source: withoutLocale });
      router.push(`/${nextLocale}/translation-in-progress?${query.toString()}`);
      return;
    }

    if (isPendingPage && safeSource) {
      const query = new URLSearchParams({ source: safeSource });
      router.push(`/${nextLocale}/translation-in-progress?${query.toString()}`);
      return;
    }

    router.push(`/${nextLocale}${withoutLocale === "/" ? "" : withoutLocale}${window.location.search}${window.location.hash}`);
  }

  return (
    <label className="language-switcher">
      <span>{copy.language}</span>
      <select value={locale} onChange={(event) => changeLanguage(event.target.value)}>
        <option value="en">{copy.languages.en}</option>
        <option value="hi">{copy.languages.hi}</option>
        <option value="gu">{copy.languages.gu}</option>
      </select>
    </label>
  );
}
