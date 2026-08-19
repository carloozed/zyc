'use client';

import React from 'react';

import styles from './CopyrightText.module.css';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

/**
 * The legal notice shown in the copyright banner and the download tooltip —
 * keep the wording in this one place.
 */
export default function CopyrightText() {
  const lang = useLocaleFromPathname();

  if (lang === 'en-us') {
    return (
      <>
        Images may be used free of charge in connection with current press
        coverage of{' '}
        <span className={styles.italic}>Zurich Youth Classical</span>, provided
        the copyright (
        <span className={styles.italic}>
          © Ueli Steingruber/Zurich Youth Classical
        </span>
        ) is credited.
      </>
    );
  }

  return (
    <>
      Bei einer Verwendung der Bilder in Zusammenhang mit einer aktuellen
      Presseberichterstattung zu{' '}
      <span className={styles.italic}>Zurich Youth Classical</span> und unter
      Nennung des Copyrights (
      <span className={styles.italic}>
        © Ueli Steingruber/Zurich Youth Classical
      </span>
      ) besteht keine Honorarpflicht.
    </>
  );
}
