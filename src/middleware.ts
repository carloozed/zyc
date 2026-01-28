import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/prismicio';

export async function middleware(request: NextRequest) {
  const client = createClient();
  const repository = await client.getRepository();

  const locales = repository.languages.map((lang) => lang.id);
  const defaultLocale =
    process.env.NODE_ENV === 'development' ? 'en-us' : 'de-ch';

  const { pathname } = request.nextUrl;

  // Block en-us until ready
  // Block en-us until ready (only in production)
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
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};
