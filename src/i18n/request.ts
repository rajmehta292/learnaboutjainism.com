import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

function isSupportedLocale(value: string | undefined): value is (typeof routing.locales)[number] {
  return routing.locales.some((supportedLocale) => supportedLocale === value);
}

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!isSupportedLocale(locale)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
