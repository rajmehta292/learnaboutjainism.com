'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { SiteLocale } from './routing';

const LocaleContext = createContext<SiteLocale>('en');

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: SiteLocale;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useSiteLocale() {
  return useContext(LocaleContext);
}
