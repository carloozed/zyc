'use client';

import React from 'react';

import { TransitionLink } from '../TransitionLink/TransitionLink';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

import styles from './NotFoundContent.module.css';

const COPY = {
  'de-ch': {
    text: 'Diese Seite gibt es nicht.',
    link: 'Zurück zur Startseite',
  },
  'en-us': { text: "This page doesn't exist.", link: 'Back to the homepage' },
};

/** Shared body of the 404 page. Client-side so it can read the locale from
 * the URL: not-found routes receive no params. */
export default function NotFoundContent() {
  const locale = useLocaleFromPathname();
  const copy = COPY[locale];
  const home = locale === 'en-us' ? '/en-us' : '/';

  return (
    <main className={styles.main} data-hide-scroll-indicator="">
      <div className={styles.decor} role="presentation">
        <span className={styles.circle} />
        <span className={styles.line} />
        <h1 className={styles.code}>404</h1>
        <span className={styles.line} />
        <span className={styles.circle} />
      </div>
      <div className={styles.text}>
        <p>{copy.text}</p>
        <TransitionLink href={home} className={styles.link}>
          {copy.link}
        </TransitionLink>
      </div>
    </main>
  );
}
