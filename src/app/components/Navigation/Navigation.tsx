import React from 'react';

import styles from './Navigation.module.css';
import HeaderContent from './HeaderContent/HeaderContent';

import { createClient } from '@/prismicio';

export default async function Navigation() {
  const client = createClient();
  const downloadbar = await client.getSingle('download_bar');
  const logo = await client.getSingle('logo');

  return (
    <header className={styles.header}>
      <HeaderContent downloadbar={downloadbar} logo={logo} />
    </header>
  );
}
