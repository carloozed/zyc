import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import styles from './page.module.css';

import { createClient } from '@/prismicio';

import AboutContent from './AboutContent/AboutContent';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle('uber_zyc', { lang })
    .catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement', { lang })
    .catch(() => notFound());

  return (
    <AboutContent
      styles={styles}
      page={page}
      foldoutElements={foldoutElements}
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
    .getSingle('uber_zyc', { lang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
