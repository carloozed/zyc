import React from 'react';
import {
  ContactAndDownloadSlice,
  IsdownloadsmutedDocument,
} from '../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

import styles from './ContactAndDownload.module.css';

type Props = {
  slice: ContactAndDownloadSlice;
  isDownloadsMuted: IsdownloadsmutedDocument;
};

export default function ContactAndDownloadContent({
  slice,
  isDownloadsMuted,
}: Props) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.section}
    >
      <div className={styles.sectioncontainer}>
        <PrismicRichText field={slice.primary.subtitle_something_missing} />
        <PrismicRichText field={slice.primary.text_missingsomething} />
        <div className={styles.linkscontainer}>
          {slice.primary.links.map((item, index: number) => (
            <div key={index} className={styles.downloadlink}>
              <PrismicNextLink field={item.link} />
              <p style={{ transform: 'rotate(-135deg)' }}>&darr;</p>
            </div>
          ))}
        </div>
      </div>
      {isDownloadsMuted &&
        isDownloadsMuted.data?.isdownloadsmuted === false && (
          <div className={styles.sectioncontainer}>
            <PrismicRichText field={slice.primary.downloads_title} />
            <PrismicRichText field={slice.primary.text_downloads} />
            <div className={styles.linkscontainer}>
              {slice.primary.download_links.map((item, index: number) => (
                <div key={index} className={styles.downloadlink}>
                  <PrismicNextLink field={item.link} />
                  <p>&darr;</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
}
