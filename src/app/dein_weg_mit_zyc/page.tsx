import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';
import Content from './content/Content';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('dein_weg').catch(() => notFound());

  return <Content page={page} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('dein_weg').catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
