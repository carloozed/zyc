'use client';

import { usePathname } from 'next/navigation';

/**
 * Locale segment of the current URL. The production middleware rewrites
 * bare paths to de-ch, so a missing prefix means German.
 */
export default function useLocaleFromPathname(): 'de-ch' | 'en-us' {
  const pathname = usePathname();
  return pathname?.startsWith('/en-us') ? 'en-us' : 'de-ch';
}
