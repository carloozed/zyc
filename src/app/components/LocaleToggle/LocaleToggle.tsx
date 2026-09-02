'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';

import stripLocale from '@/helpers/stripLocale';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

import styles from './LocaleToggle.module.css';

type Props = {
  variant?: 'header' | 'footer';
  inverted?: boolean;
};

/** DE | EN switch to the same page in the other locale. German lives on the
 * bare path, English under the /en-us prefix (see middleware). The header
 * variant separates the languages with the site's circle-line-circle decor;
 * `inverted` flips it to white for the dark homepage hero (like the logo). */
export default function LocaleToggle({ variant = 'header', inverted = false }: Props) {
  const locale = useLocaleFromPathname();
  const path = stripLocale(usePathname() ?? '/');

  const targets = [
    { code: 'de-ch', label: 'DE', href: path },
    { code: 'en-us', label: 'EN', href: path === '/' ? '/en-us' : `/en-us${path}` },
  ] as const;

  const separator =
    variant === 'header' ? (
      <span className={styles.decor} aria-hidden="true">
        <span className={styles.decorcircle} />
        <span className={styles.decorline} />
        <span className={styles.decorcircle} />
      </span>
    ) : (
      <div className={styles.divider} />
    );

  return (
    <div
      className={`${styles.toggle} ${styles[variant]}${inverted ? ` ${styles.inverted}` : ''}`}
      aria-label="Sprache / Language"
    >
      {targets.map((target, index) => (
        <React.Fragment key={target.code}>
          {index > 0 && separator}
          {target.code === locale ? (
            <span className={styles.active} aria-current="true">
              {target.label}
            </span>
          ) : (
            <Link
              href={target.href}
              lang={target.code === 'de-ch' ? 'de' : 'en'}
              className={styles.inactive}
            >
              {target.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
