import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';
import { PrismicRichText, SliceZone } from '@prismicio/react';

import styles from './page.module.css';

import { createClient } from '@/prismicio';
import { components } from '@/slices';

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('uber_zyc').catch(() => notFound());
  const foldoutElements = await client
    .getAllByType('foldoutelement')
    .catch(() => notFound());

  return (
    <section className={styles.page}>
      <PrismicRichText field={page.data.page_title} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements }}
      />
    </section>
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
