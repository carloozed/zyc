import React from 'react';

import { DownloadBarDocument } from '../../../../../../prismicio-types';
import styles from './DownloadBar.module.css';
import { PrismicNextLink } from '@prismicio/next';

type Props = {
  downloadbar: DownloadBarDocument;
};

export default function DownloadBar({ downloadbar }: Props) {
  return (
    <div className={styles.downloadbar__container}>
      <h5 className={styles.downloadbar__text}>
        {downloadbar.data.is_download_available === 'Stundenplan'
          ? `${downloadbar.data.schedule_is_available}`
          : downloadbar.data.is_download_available === 'Resultate'
            ? `${downloadbar.data.results_are_available}`
            : null}
      </h5>
      {downloadbar.data.is_download_available === 'Stundenplan' ? (
        <PrismicNextLink field={downloadbar.data.schedule_link} />
      ) : downloadbar.data.is_download_available === 'Resultate' ? (
        <PrismicNextLink field={downloadbar.data.results_link} />
      ) : null}
    </div>
  );
}
