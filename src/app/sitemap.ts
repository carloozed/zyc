import type { MetadataRoute } from 'next';
import type { PrismicDocument } from '@prismicio/client';

import { createClient } from '@/prismicio';
import {
  SITE_URL,
  hreflangLanguages,
  isLocale,
  localePath,
  type Locale,
} from '@/helpers/seo';

/** Single-document page types and their path, same in both locales. Keep
 * in sync with the Route Map in AGENTS.md when adding a page. */
const SINGLE_PAGES = [
  ['the_contest', '/the_contest'],
  ['the_cadenza', '/the_cadenza'],
  ['the_crescendo', '/the_crescendo'],
  ['teilnahme_termine', '/termine'],
  ['magazin', '/magazin'],
  ['uber_zyc', '/ueber_zyc'],
  ['gallery', '/galerie'],
  ['impresssum', '/impressum'],
  ['datenschutz', '/datenschutz'],
  ['newsletter_form', '/newsletter'],
] as const;

type PathFor = (uid: string | null | undefined) => string;
type Group = { docs: PrismicDocument[]; pathFor: PathFor };

/* Regenerated at most hourly; the Prismic webhook's revalidateTag('prismic')
   refreshes it sooner. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();

  const groups: Group[] = await Promise.all([
    client.getAllByType('page', { lang: '*' }).then((docs) => ({
      docs: docs.filter((doc) => doc.uid === 'home'),
      pathFor: () => '/',
    })),
    client.getAllByType('magazinpost', { lang: '*' }).then((docs) => ({
      docs,
      pathFor: (uid: string | null | undefined) => `/magazin/${uid}`,
    })),
    ...SINGLE_PAGES.map(([type, path]) =>
      client
        .getAllByType(type, { lang: '*' })
        .then((docs) => ({ docs, pathFor: () => path })),
    ),
  ]);

  return groups.flatMap(({ docs, pathFor }) =>
    docs.flatMap((doc) => {
      if (!isLocale(doc.lang)) return [];

      // The document's own locale plus every published translation.
      const paths: Partial<Record<Locale, string>> = {
        [doc.lang]: pathFor(doc.uid),
      };
      for (const alt of doc.alternate_languages) {
        if (isLocale(alt.lang)) paths[alt.lang] = pathFor(alt.uid);
      }

      return [
        {
          url: SITE_URL + localePath(doc.lang, pathFor(doc.uid)),
          lastModified: doc.last_publication_date,
          alternates: { languages: hreflangLanguages(paths, SITE_URL) },
        },
      ];
    }),
  );
}
