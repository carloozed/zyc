import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';

import CadenzaContent from './CadenzaContent';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('the_cadenza').catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement')
    .catch(() => notFound());

  return <CadenzaContent page={page} foldoutElements={foldoutElements} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('the_cadenza').catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
