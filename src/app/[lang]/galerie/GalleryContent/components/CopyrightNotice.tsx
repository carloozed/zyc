'use client';

import React, { useState, useEffect } from 'react';

import styles from './CopyrightNotice.module.css';

export default function CopyrightNotice() {
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
        aria-label="Copyright-Hinweis anzeigen"
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
        aria-label="Schliessen"
      >
        ×
      </button>
      <p className={styles.text}>
        Bei einer Verwendung der Bilder in Zusammenhang mit einer aktuellen
        Presseberichterstattung zu Zurich Youth Classical und unter Nennung des
        Copyrights (© Ueli Steingruber/Zurich Youth Classical) besteht keine
        Honorarpflicht.
      </p>
    </div>
  );
}
