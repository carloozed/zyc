import React from 'react';

import styles from './CopyrightText.module.css';

/**
 * The legal notice shown in the copyright banner and the download tooltip —
 * keep the wording in this one place.
 */
export default function CopyrightText() {
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
