import React from 'react';

import styles from './Navigation.module.css';

import { createClient } from '@/prismicio';
import Content from './Content';

export default async function Navigation() {
  const lang = process.env.NODE_ENV === 'development' ? 'en-us' : 'de-ch';

  const client = createClient();
  const downloadbar = await client.getSingle('download_bar', { lang });
  const logo = await client.getSingle('logo', { lang });
  const navbar = await client.getSingle('navbar', { lang });
  const lownavigations = await client.getAllByType('low_navigation', { lang });
  const address = await client.getSingle('address', { lang });
  const indicator = await client.getSingle('navigation_indicator', { lang });
  const subnavigation = await client.getSingle('subnavigation', { lang });
  const timelineBroad = await client.getSingle('timeline', { lang });
  const termineIsVisible = await client.getSingle('termine_is_visible', { lang });

  const lowNavigation = lownavigations.find((item) => {
    return item.uid === 'legal-information-contact';
  });

  return (
    <header className={styles.header}>
      <Content
        styles={styles}
        downloadbar={downloadbar}
        logo={logo}
        navbar={navbar}
        lownavigations={lownavigations}
        lowNavigation={lowNavigation}
        address={address}
        indicator={indicator}
        subnavigation={subnavigation}
        timelineBroad={timelineBroad}
        termineIsVisible={termineIsVisible}
      />
    </header>
  );
}
