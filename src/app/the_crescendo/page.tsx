import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';
import CreschendoContent from './CrescendoContent/CreschendoContent';

import { createClient } from '@/prismicio';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('the_crescendo').catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement')
    .catch(() => notFound());
  const signuplink = await client.getSingle('anmeldelink');

  return (
    <CreschendoContent
      page={page}
      foldoutElements={foldoutElements}
      signuplink={signuplink}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('the_crescendo').catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
