import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';
import { localeAlternates } from '@/helpers/seo';

import GalleryContent from './GalleryContent/GalleryContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // Render per request: GalleryContent reads the `ansicht` query param, and a
  // static page would only know it after hydration and flash the photos first.
  await connection();
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('gallery', { lang })
    .catch(() => notFound());
  const decoimage = await client.getSingle('decoration_image', { lang });

  return <GalleryContent page={page} decoimage={decoimage} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('gallery', { lang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: localeAlternates(lang, '/galerie'),
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
