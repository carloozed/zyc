'use client';

import React from 'react';
import {
  AnmeldelinkDocument,
  ContactAndDownloadSlice,
} from '@/prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

import styles from './ContactAndDownload.module.css';

import { useMobile } from '@/contexts/MobileContext';
import isSignupWindowOpen from '@/helpers/isSignupWindowOpen';

import NewsletterLink from '@/app/components/NewsletterLink/NewsletterLink';
import ContactLink from '@/app/components/ContactLink/ContactLink';

type Props = {
  slice: ContactAndDownloadSlice;
  signuplink: AnmeldelinkDocument;
};

type LinkField =
  ContactAndDownloadSlice['primary']['links'][number]['link'];

function ContactItemLink({ link }: { link: LinkField }) {
  switch (link.text) {
    case 'Anmeldung Newsletter':
      return (
        <NewsletterLink
          hasUnderscore={true}
          hasAnmeldung={true}
          hasBorder={false}
        />
      );
    case 'Kontaktiere uns':
      return (
        <ContactLink
          hasUnderscore={true}
          hasBorder={false}
          buttonText={'Kontaktiere uns'}
        />
      );
    default:
      return <PrismicNextLink field={link} target="_blank" />;
  }
}

export default function ContactAndDownloadContent({
  slice,
  signuplink,
}: Props) {
  const { isMobile, isTabletPortrait } = useMobile();

  const showSignupLink =
    isSignupWindowOpen(signuplink) &&
    (isTabletPortrait || (isMobile && slice.variation === 'default'));

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
              <ContactItemLink link={item.link} />
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
      {showSignupLink && (
        <div className={styles.signuplink}>
          <PrismicNextLink field={signuplink.data.anmeldelink}>
            Anmelden
          </PrismicNextLink>
        </div>
      )}
    </section>
  );
}
