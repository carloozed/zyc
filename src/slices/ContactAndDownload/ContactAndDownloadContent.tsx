'use client';

import React from 'react';
import {
  AnmeldelinkDocument,
  ContactAndDownloadSlice,
  IsdownloadsmutedDocument,
} from '../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

import styles from './ContactAndDownload.module.css';

import { useMobile } from '@/contexts/MobileContext';

import NewsletterLink from '@/app/components/NewsletterLink/NewsletterLink';

type Props = {
  slice: ContactAndDownloadSlice;
  isDownloadsMuted: IsdownloadsmutedDocument;
  signuplink: AnmeldelinkDocument;
};

export default function ContactAndDownloadContent({
  slice,
  isDownloadsMuted,
  signuplink,
}: Props) {
  const { isMobile, isTabletPortrait } = useMobile();

  console.log(signuplink);

  const shouldShowBasedOnDates = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const buttonShowDate =
      signuplink.data.show_button_date?.split('T')[0] ||
      signuplink.data.show_button_date;
    const buttonHideDate =
      signuplink.data.hide_button_date?.split('T')[0] ||
      signuplink.data.hide_button_date;

    if (!buttonShowDate) return false;

    const isPastShowDate = currentDate >= buttonShowDate;

    if (!buttonHideDate) return isPastShowDate;

    const isBeforeHideDate = currentDate < buttonHideDate;

    return isPastShowDate && isBeforeHideDate;
  };

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
              {item.link.text === 'Anmeldung Newsletter' ? (
                <NewsletterLink hasUnderscore={true} hasAnmeldung={true} />
              ) : (
                <PrismicNextLink field={item.link} />
              )}

              <p style={{ transform: 'rotate(-135deg)' }}>&darr;</p>
            </div>
          ))}
        </div>
      </div>
      {slice.variation === 'default' &&
        isDownloadsMuted &&
        isDownloadsMuted.data?.isdownloadsmuted === true && (
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
      {shouldShowBasedOnDates() &&
        isMobile &&
        slice.variation === 'default' && (
          <div className={styles.signuplink}>
            <PrismicNextLink field={signuplink.data.anmeldelink}>
              Anmelden
            </PrismicNextLink>
          </div>
        )}

      {shouldShowBasedOnDates() && isTabletPortrait && (
        <div className={styles.signuplink}>
          <PrismicNextLink field={signuplink.data.anmeldelink}>
            Anmelden
          </PrismicNextLink>
        </div>
      )}
    </section>
  );
}
