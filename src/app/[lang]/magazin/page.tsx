import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';
import MagazineContent from './components/MagazineContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('magazin', { lang })
    .catch(() => notFound());
  const magazinePosts = await client
    .getAllByType('magazinpost', { lang })
    .catch(() => notFound());
  const instaIcon = await client.getSingle('instagram_icon', { lang });
  const decoimage = await client.getSingle('decoration_image', { lang });

  return (
    <MagazineContent
      page={page}
      magazinPosts={magazinePosts}
      instaIcon={instaIcon}
      decoimage={decoimage}
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
  const page = await client.getSingle('magazin', { lang });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
