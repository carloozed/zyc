import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import styles from './page.module.css';

import { createClient } from '@/prismicio';

import AboutContent from './AboutContent/AboutContent';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('uber_zyc').catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement')
    .catch(() => notFound());

  return (
    <AboutContent
      styles={styles}
      page={page}
      foldoutElements={foldoutElements}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('uber_zyc').catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}
