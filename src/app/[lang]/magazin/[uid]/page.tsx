import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc } from '@prismicio/client';

import { createClient } from '@/prismicio';
import PostContent from './components/PostContent';

type Params = { uid: string; lang: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid, lang } = await params;
  const client = createClient();
  const page = await client
    .getByUID('magazinpost', uid, { lang })
    .catch(() => notFound());

  const instaIcon = await client.getSingle('instagram_icon', { lang });

  return <PostContent page={page} instaIcon={instaIcon} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, lang } = await params;
  const client = createClient();
  const page = await client
    .getByUID('magazinpost', uid, { lang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType('magazinpost', { lang: '*' });

  return pages.map((page) => ({ uid: page.uid, lang: page.lang }));
}
