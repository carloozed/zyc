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
import ContactLink from '@/app/components/ContactLink/ContactLink';

type Props = {
  slice: ContactAndDownloadSlice;
  isDownloadsMuted?: IsdownloadsmutedDocument;
  signuplink: AnmeldelinkDocument;
};

export default function ContactAndDownloadContent({
  slice,

  signuplink,
}: Props) {
  const { isMobile, isTabletPortrait } = useMobile();

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
                <NewsletterLink
                  hasUnderscore={true}
                  hasAnmeldung={true}
                  hasBorder={false}
                />
              ) : item.link.text === 'Kontaktiere uns' ? (
                <ContactLink
                  hasUnderscore={true}
                  hasBorder={false}
                  buttonText={'Kontaktiere uns'}
                />
              ) : (
                <PrismicNextLink field={item.link} target="_blank" />
              )}

              <p style={{ transform: 'rotate(-135deg)' }}>&darr;</p>
            </div>
          ))}
        </div>
      </div>
      {slice.variation === 'default' && (
        <div className={styles.sectioncontainer}>
          <PrismicRichText field={slice.primary.downloads_title} />
          <PrismicRichText field={slice.primary.text_downloads} />
          <div className={styles.linkscontainer}>
            {slice.primary.download_links.map((item, index: number) => (
              <div key={index} className={styles.downloadlink}>
                <PrismicNextLink field={item.link} target="_blank" />
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
