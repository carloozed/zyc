import { type Metadata } from 'next';

import { asText } from '@prismicio/client';
import { SliceZone } from '@prismicio/react';

import { createClient } from '@/prismicio';
import { components } from '@/slices';

import styles from './page.module.css';

export default async function Home() {
  const client = createClient();
  const home = await client.getByUID('page', 'home');
  const background = await client.getSingle('landing_background_image');

  // <SliceZone> renders the page's slices.

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url(${background.data.image.url})` }}
    >
      <SliceZone slices={home.data.slices} components={components} />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID('page', 'home');

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? '' }],
    },
  };
}
