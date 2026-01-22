import {
  createClient as baseCreateClient,
  ClientConfig,
  Route,
} from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import sm from '../slicemachine.config.json';

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic route resolvers. This list determines a Prismic document's URL.
 */
const routes: Route[] = [
  { type: 'page', uid: 'home', path: '/:lang?' },
  { type: 'the_contest', path: '/:lang?/the_contest' },
  { type: 'the_cadenza', path: '/:lang?/the_cadenza' },
  { type: 'the_crescendo', path: '/:lang?/the_crescendo' },
  { type: 'teilnahme_termine', path: '/:lang?/termine' },
  { type: 'magazin', path: '/:lang?/magazin' },
  { type: 'magazinpost', path: '/:lang?/magazin/:uid' },
  { type: 'uber_zyc', path: '/:lang?/ueber_zyc' },
  { type: 'impresssum', path: '/:lang?/impressum' },
  { type: 'datenschutz', path: '/:lang?/datenschutz' },
];
/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export function createClient(config: ClientConfig = {}) {
  const client = baseCreateClient(sm.apiEndpoint || repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === 'production'
        ? { next: { tags: ['prismic'] }, cache: 'force-cache' }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}
