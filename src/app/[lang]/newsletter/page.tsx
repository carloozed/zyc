import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc, asText } from '@prismicio/client';

import { createClient } from '@/prismicio';

import NewsletterPageContent from './NewsletterPageContent';

type Params = Promise<{ lang: string }>;

/** Standalone newsletter signup, meant to be linked directly (mailings,
 * social bios). Reads the same `newsletter_form` document as the modal. */
export default async function Page({ params }: { params: Params }) {
  const { lang } = await params;
  const client = createClient();
  const newsletter = await client
    .getSingle('newsletter_form', { lang })
    .catch(() => notFound());

  return <NewsletterPageContent newsletter={newsletter} />;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const newsletter = await client
    .getSingle('newsletter_form', { lang })
    .catch(() => notFound());

  return {
    title: 'ZYC | Newsletter',
    description: asText(newsletter.data.newsletter_text),
    openGraph: {
      images: [{ url: asImageSrc(newsletter.data.newsletter_image) ?? '' }],
    },
  };
}
