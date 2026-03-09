import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/prismicio';

let cachedLocales: string[] | null = null;

export async function middleware(request: NextRequest) {
  if (!cachedLocales) {
    const client = createClient();
    const repository = await client.getRepository();
    cachedLocales = repository.languages.map((lang) => lang.id);
  }

  const locales = cachedLocales; // use the cache, no more client/repository calls here
  const defaultLocale =
    process.env.NODE_ENV === 'development' ? 'en-us' : 'de-ch';

  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV !== 'development' && pathname.startsWith('/en-us')) {
    return NextResponse.redirect(new URL('/', request.url));
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
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
