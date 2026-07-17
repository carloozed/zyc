import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';
import buildPageMetadata from '@/helpers/buildPageMetadata';

import ContestContent from './ContestContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('the_contest', { lang })
    .catch(() => notFound());
  const wearehereicon = await client
    .getSingle('we_are_here_image', { lang })
    .catch(() => notFound());
  const disciplinetypes = await client
    .getAllByType('criteriatypesubfield', { lang })
    .catch(() => notFound());
  const signuplink = await client
    .getSingle('anmeldelink', { lang })
    .catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement', { lang })
    .catch(() => notFound());
  const isDownloadsMuted = await client
    .getByType('isdownloadsmuted', { lang })
    .catch(() => notFound());

  return (
    <ContestContent
      signuplink={signuplink}
      foldoutElements={foldoutElements}
      disciplinetypes={disciplinetypes}
      wearehereicon={wearehereicon}
      page={page}
      isDownloadsMuted={isDownloadsMuted}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('the_contest', { lang })
    .catch(() => notFound());

  return buildPageMetadata(page.data);
}
