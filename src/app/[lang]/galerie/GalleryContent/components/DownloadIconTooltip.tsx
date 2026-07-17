import React from 'react';

import styles from './DownloadIconTooltip.module.css';
import CopyrightText from './CopyrightText';

export default function DownloadIconTooltip() {
  return (
    <div className={styles.tooltip}>
      <p>
        <CopyrightText />
      </p>
    </div>
  );
}
