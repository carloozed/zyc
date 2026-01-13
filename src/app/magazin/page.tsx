import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';
import MagazineContent from './components/MagazineContent';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('magazin').catch(() => notFound());
  const magazinePosts = await client
    .getAllByType('magazinpost')
    .catch(() => notFound());
  const instaIcon = await client.getSingle('instagram_icon');

  return (
    <MagazineContent
      page={page}
      magazinPosts={magazinePosts}
      instaIcon={instaIcon}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('magazin');

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
