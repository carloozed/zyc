'use client';

import React from 'react';

import { DownloadBarDocument } from '@/prismicio-types';
import styles from './DownloadBar.module.css';
import { PrismicNextLink } from '@prismicio/next';
import useHideOnScroll from '@/app/components/Navigation/useHideOnScroll';

type Props = {
  downloadbar: DownloadBarDocument;
};

export default function DownloadBar({ downloadbar }: Props) {
  const showNavbar = useHideOnScroll();

  return (
    <div
      className={`${styles.downloadbar__container} ${showNavbar ? styles.downloadbar__visible : styles.downloadbar__hidden}`}
    >
      <h5 className={styles.downloadbar__text}>
        {downloadbar.data.is_download_available == 'Stundenplan'
          ? `${downloadbar.data.schedule_is_available}`
          : downloadbar.data.is_download_available == 'Resultate'
            ? `${downloadbar.data.results_are_available}`
            : null}
      </h5>
      {downloadbar.data.is_download_available == 'Stundenplan' ? (
        <PrismicNextLink field={downloadbar.data.schedule_link} />
      ) : downloadbar.data.is_download_available == 'Resultate' ? (
        <PrismicNextLink field={downloadbar.data.results_link} />
      ) : null}
    </div>
  );
}
