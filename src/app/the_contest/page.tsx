import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';

import ContestContent from './ContestContent';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('the_contest').catch(() => notFound());
  const wearehereicon = await client
    .getSingle('we_are_here_image')
    .catch(() => notFound());
  const disciplinetypes = await client
    .getAllByType('criteriatypesubfield')
    .catch(() => notFound());
  const signuplink = await client
    .getSingle('anmeldelink')
    .catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement')
    .catch(() => notFound());
  const isDownloadsMuted = await client
    .getByType('isdownloadsmuted')
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

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('the_contest').catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
