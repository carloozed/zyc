'use client';

import React from 'react';

import styles from './HeaderContent.module.css';
import { DownloadBarDocument } from '../../../../../prismicio-types';
import { LogoDocument } from '../../../../../prismicio-types';

/* Component Imports */
import DownloadBar from './DownloadBar/DownloadBar';
import { PrismicNextImage } from '@prismicio/next';
import Hamburger from './Hamburger/Hamburger';

type Props = {
  downloadbar: DownloadBarDocument;
  logo: LogoDocument;
};

export default function HeaderContent({ downloadbar, logo }: Props) {
  return (
    <div className={styles.header__content}>
      <div className={styles.header__logocontainer}>
        <PrismicNextImage field={logo.data.image} />
      </div>
      <div className={styles.header__downloadbar}>
        {downloadbar.data.is_download_available !== 'Nichts' && (
          <DownloadBar downloadbar={downloadbar} />
        )}
      </div>
      <div className={styles.header__hamburger}>
        <Hamburger />
      </div>
    </div>
  );
}
