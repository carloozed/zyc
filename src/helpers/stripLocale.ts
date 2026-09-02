/**
 * Pathname without its leading locale segment (`/en-us/magazin` → `/magazin`).
 * Bare paths are the de-ch default and come back unchanged, so route checks
 * like `stripLocale(pathname) === '/magazin'` hold in every locale.
 */
export default function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/[a-z]{2}-[a-z]{2}(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
