import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';
import buildPageMetadata from '@/helpers/buildPageMetadata';

import GalleryContent from './GalleryContent/GalleryContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client.getSingle('gallery').catch(() => notFound());
  const decoimage = await client.getSingle('decoration_image', { lang });

  return <GalleryContent page={page} decoimage={decoimage} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('gallery').catch(() => notFound());

  return buildPageMetadata(page.data);
}
