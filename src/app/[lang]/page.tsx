import { type Metadata } from 'next';
import { asText } from '@prismicio/client';
import { createClient } from '@/prismicio';
import styles from './page.module.css';
import LandingContent from '../components/Landing/LandingContent';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();

  // Fetch both documents in parallel for better performance
  const [background, landingNavigation, hoverElements, termineIsVisible] =
    await Promise.all([
      client.getSingle('landing_background_image'),
      client.getSingle('homepage_navigation', { lang }),
      client.getAllByType('dynamiclandingcontent', { lang }),
      client.getSingle('termine_is_visible'),
    ]);

  return (
    <main className={styles.main}>
      <LandingContent
        landingNavigation={landingNavigation}
        hoverElements={hoverElements}
        background={background}
        termineIsVisible={termineIsVisible}
      />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const home = await client.getByUID('page', 'home', { lang });

  return {
    title: asText(home.data.title),
    description: home.data.meta_description ?? '',
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [
        {
          url: home.data.meta_image?.url ?? '',
        },
      ],
    },
  };
}
