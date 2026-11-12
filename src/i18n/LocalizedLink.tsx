'use client';

import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useSiteLocale } from './LocaleProvider';

type Props = ComponentProps<typeof NextLink>;

function localizePath(path: string, locale: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  const localePrefix = `/${locale}`;
  if (path === localePrefix || path.startsWith(`${localePrefix}/`)) return path;

  return `${localePrefix}${path === '/' ? '' : path}`;
}

export function LocalizedLink({ href, ...props }: Props) {
  const locale = useSiteLocale();
  const localizedHref =
    typeof href === 'string'
      ? localizePath(href, locale)
      : { ...href, pathname: localizePath(href.pathname ?? '/', locale) };

  return <NextLink href={localizedHref} {...props} />;
}
