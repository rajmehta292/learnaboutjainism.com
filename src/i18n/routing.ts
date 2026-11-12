export const routing = {
  locales: ['en', 'hi', 'gu'],
  publishedLocales: ['en'],
  defaultLocale: 'en',
} as const;

export type SiteLocale = (typeof routing.locales)[number];

export { LocalizedLink as Link } from './LocalizedLink';
