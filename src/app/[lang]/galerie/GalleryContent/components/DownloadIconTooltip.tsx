import React from 'react';

import styles from './DownloadIconTooltip.module.css';

export default function DownloadIconTooltip() {
  return (
    <div className={styles.tooltip}>
      <p>
        Bei einer Verwendung der Bilder in Zusammenhang mit einer aktuellen
        Presseberichterstattung zu{' '}
        <span className={styles.italic}>Zurich Youth Classical</span> und unter
        Nennung des Copyrights (
        <span className={styles.italic}>
          © Ueli Steingruber/Zurich Youth Classical
        </span>
        ) besteht keine Honorarpflicht.
      </p>
    </div>
  );
}
