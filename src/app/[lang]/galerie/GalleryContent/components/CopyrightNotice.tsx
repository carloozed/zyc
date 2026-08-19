'use client';

import React, { useState, useEffect } from 'react';

import styles from './CopyrightNotice.module.css';
import CopyrightText from './CopyrightText';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

export default function CopyrightNotice() {
  const lang = useLocaleFromPathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 1200);
  }

  function handleReopen() {
    setIsDismissed(false);
    requestAnimationFrame(() => setIsVisible(true));
  }

  if (isDismissed) {
    return (
      <button
        className={styles.reopenButton}
        onClick={handleReopen}
        aria-label={
          lang === 'en-us'
            ? 'Show copyright notice'
            : 'Copyright-Hinweis anzeigen'
        }
      >
        ©
      </button>
    );
  }

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label={lang === 'en-us' ? 'Close' : 'Schliessen'}
      >
        ×
      </button>
      <p className={styles.text}>
        <CopyrightText />
      </p>
    </div>
  );
}
