import type { Metadata } from 'next';

/** Canonical production origin. The apex domain 308s to www. */
export const SITE_URL = 'https://www.zurichyouthclassical.ch';

export const LOCALES = ['de-ch', 'en-us'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'de-ch';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** hreflang codes in the casing search engines expect. */
const HREFLANG = { 'de-ch': 'de-CH', 'en-us': 'en-US' } as const;

type Hreflang = (typeof HREFLANG)[Locale] | 'x-default';

/** Public path of a page in a locale: German on bare paths, English under
 * its prefix, mirroring the middleware's canonicalisation. */
export function localePath(locale: string, path: string): string {
  const bare = path === '/' ? '' : path;
  return locale === DEFAULT_LOCALE ? bare || '/' : `/${locale}${bare}`;
}

/** Path per locale. A plain string means the same path in every locale,
 * which holds for every page except magazine posts (UID per document). */
export type LocalePaths = string | Partial<Record<Locale, string>>;

function toPaths(paths: LocalePaths): Partial<Record<Locale, string>> {
  return typeof paths === 'string' ? { 'de-ch': paths, 'en-us': paths } : paths;
}

/** hreflang → URL for each locale the page exists in, plus `x-default`
 * pointing at the German page. `base` makes the URLs absolute; page
 * metadata leaves it empty and relies on the root layout's metadataBase. */
export function hreflangLanguages(
  paths: LocalePaths,
  base = '',
): Partial<Record<Hreflang, string>> {
  const byLocale = toPaths(paths);
  const languages: Partial<Record<Hreflang, string>> = {};
  let xDefault: string | undefined;

  for (const locale of LOCALES) {
    const path = byLocale[locale];
    if (path === undefined) continue;
    const url = base + localePath(locale, path);
    languages[HREFLANG[locale]] = url;
    if (locale === DEFAULT_LOCALE || xDefault === undefined) xDefault = url;
  }

  if (xDefault !== undefined) languages['x-default'] = xDefault;
  return languages;
}

/** `alternates` metadata for a page: its canonical URL and the hreflang
 * links to every locale version. Every page's generateMetadata uses it. */
export function localeAlternates(
  locale: string,
  paths: LocalePaths,
): Metadata['alternates'] {
  const own = isLocale(locale) ? toPaths(paths)[locale] : undefined;

  return {
    canonical: own === undefined ? undefined : localePath(locale, own),
    languages: hreflangLanguages(paths),
  };
}
