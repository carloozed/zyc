import { type Metadata } from 'next';
import { asText } from '@prismicio/client';
import { createClient } from '@/prismicio';
import styles from './page.module.css';
import LandingContent from './Landing/LandingContent';

export default async function Home() {
  const client = createClient();

  // Fetch both documents in parallel for better performance
  const [background, landingNavigation] = await Promise.all([
    client.getSingle('landing_background_image'),
    client.getSingle('homepage_navigation'),
  ]);

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: background?.data?.image?.url
          ? `url(${background.data.image.url})`
          : undefined,
      }}
    >
      <LandingContent landingNavigation={landingNavigation} />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID('page', 'home');

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
