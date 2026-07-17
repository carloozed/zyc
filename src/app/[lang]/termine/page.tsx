import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';
import buildPageMetadata from '@/helpers/buildPageMetadata';

import TermineContent from './Content/TermineContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('teilnahme_termine', { lang })
    .catch(() => notFound());
  const signuplink = await client.getSingle('anmeldelink', { lang });
  return <TermineContent page={page} signuplink={signuplink} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('teilnahme_termine', { lang })
    .catch(() => notFound());

  return buildPageMetadata(page.data);
}
