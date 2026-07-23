'use client';

import React, { useRef } from 'react';
import {
  AnmeldelinkDocument,
  ContactAndDownloadSlice,
  IsdownloadsmutedDocument,
} from '@/prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import { RevealText } from '@/app/components/RevealText/RevealText';

import styles from './ContactAndDownload.module.css';

import { useMobile } from '@/contexts/MobileContext';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Each subsection fades its text and links in on its own trigger,
      // links cascading after the text.
      gsap.utils
        .toArray<HTMLElement>('.cd-section', sectionRef.current)
        .forEach((group) => {
          gsap.from(group.querySelectorAll('.cd-fade'), {
            autoAlpha: 0,
            y: 24,
            duration: 1.2,
            ease: siteEase,
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: 'top 75%' },
          });
        });
    },
    { scope: sectionRef },
  );

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
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.section}
    >
      <div className={`cd-section ${styles.sectioncontainer}`}>
        <RevealText
          field={slice.primary.subtitle_something_missing}
          useScrollTrigger={true}
          as={'h3'}
        />
        <div className="cd-fade">
          <PrismicRichText field={slice.primary.text_missingsomething} />
        </div>
        <div className={styles.linkscontainer}>
          {slice.primary.links.map((item, index: number) => (
            <div key={index} className={`cd-fade ${styles.downloadlink}`}>
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
        <div className={`cd-section ${styles.sectioncontainer}`}>
          <RevealText
            field={slice.primary.downloads_title}
            useScrollTrigger={true}
            as={'h3'}
          />
          <div className="cd-fade">
            <PrismicRichText field={slice.primary.text_downloads} />
          </div>
          <div className={styles.linkscontainer}>
            {slice.primary.download_links.map((item, index: number) => (
              <div key={index} className={`cd-fade ${styles.downloadlink}`}>
                <PrismicNextLink field={item.link} target="_blank" />
                <p>&darr;</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {shouldShowBasedOnDates() &&
        (isMobile || isTabletPortrait) &&
        slice.variation === 'default' && (
          <div className={styles.signuplink}>
            <PrismicNextLink field={signuplink.data.anmeldelink}>
              Anmelden
            </PrismicNextLink>
          </div>
        )}
    </section>
  );
}
