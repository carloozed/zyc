import React from 'react';

import styles from './Navigation.module.css';

import { createClient } from '@/prismicio';
import Content from './Content';

export default async function Navigation() {
  const client = createClient();
  const downloadbar = await client.getSingle('download_bar');
  const logo = await client.getSingle('logo');
  const navbar = await client.getSingle('navbar');
  const lownavigations = await client.getAllByType('low_navigation');
  const address = await client.getSingle('address');

  return (
    <header className={styles.header}>
      <Content
        styles={styles}
        downloadbar={downloadbar}
        logo={logo}
        navbar={navbar}
        lownavigations={lownavigations}
        address={address}
      />
    </header>
  );
}
