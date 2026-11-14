import en from "../../messages/en.json";
import hi from "../../messages/hi.json";
import gu from "../../messages/gu.json";
import type { SiteLocale } from "./routing";

export type SiteCopy = typeof en;

const dictionaries: Record<SiteLocale, SiteCopy> = {
  en,
  hi: hi as SiteCopy,
  gu: gu as SiteCopy,
};

export function getMessages(locale: SiteLocale): SiteCopy {
  return dictionaries[locale];
}

export function englishHref(locale: SiteLocale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return "/en";
  return locale === "en" ? path : `/en${path === "/" ? "" : path}`;
}
