'use client';

import React, { useState } from 'react';

import DownloadIcon from '@/app/components/DownloadIcon/DownloadIcon';

import styles from './DownloadIconGallery.module.css';
import DownloadIconTooltip from './DownloadIconTooltip';

export default function DownloadIconGallery() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className={styles.iconcontainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.iconrelative}>
        <DownloadIcon strokeColor="black" height="40px" width="40px" />
        <div
          className={`${styles.tooltipcontainer} ${isHovered && styles.visible}`}
        >
          <DownloadIconTooltip />
        </div>
      </div>
    </div>
  );
}
