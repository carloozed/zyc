import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/prismicio';

let cachedLocales: string[] | null = null;

const defaultLocale = 'de-ch';

export async function middleware(request: NextRequest) {
  if (!cachedLocales) {
    const client = createClient();
    const repository = await client.getRepository();
    cachedLocales = repository.languages.map((lang) => lang.id);
  }

  const locales = cachedLocales; // use the cache, no more client/repository calls here

  const { pathname } = request.nextUrl;

  // The default locale is canonical on bare paths — an explicit /de-ch
  // prefix redirects there so every page has exactly one URL.
  if (
    pathname === `/${defaultLocale}` ||
    pathname.startsWith(`/${defaultLocale}/`)
  ) {
    const bare = pathname.slice(`/${defaultLocale}`.length) || '/';
    return NextResponse.redirect(new URL(bare, request.url));
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }
}

export const config = {
  matcher: ['/((?!_next|api|slice-simulator|favicon.ico|.*\\..*).*)'],
};
