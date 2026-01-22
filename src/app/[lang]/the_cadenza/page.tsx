import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';

import CadenzaContent from './CadenzaContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('the_cadenza', { lang })
    .catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement', { lang })
    .catch(() => notFound());
  const signuplink = await client.getSingle('anmeldelink', { lang });

  return (
    <CadenzaContent
      page={page}
      foldoutElements={foldoutElements}
      signuplink={signuplink}
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
    .getSingle('the_cadenza', { lang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
