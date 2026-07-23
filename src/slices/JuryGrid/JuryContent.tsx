'use client';

import React, { useRef } from 'react';
import { asText } from '@prismicio/client';
import { JuryGridSlice } from '@/prismicio-types';

import styles from './JuryContent.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { RevealText } from '@/app/components/RevealText/RevealText';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { slice: JuryGridSlice };

export default function JuryContent({ slice }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Intro text and each member card fade up as they scroll into view.
      gsap.utils
        .toArray<HTMLElement>('.jury-fade', sectionRef.current)
        .forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 1.2,
            ease: siteEase,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          });
        });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.jury__sectioncontainer}
      id="jury"
    >
      <RevealText
        field={slice.primary.headline}
        useScrollTrigger={true}
        as={'h2'}
      />
      <div className={`jury-fade ${styles.jury__introduction}`}>
        <PrismicRichText field={slice.primary.introduction} />
      </div>
      <div className={styles.jury__members}>
        {slice.primary.members.map((item, index) => (
          <div key={index} className={`jury-fade ${styles.jury__member}`}>
            <div>
              <div className={styles.jury__container}>
                <div className={styles.jury__uppercontainer}>
                  <PrismicNextImage field={item.photo} />
                  <PrismicRichText field={item.bio} />
                </div>
                <div className={styles.jury__lowercontainer}>
                  <PrismicRichText field={item.name} />
                  <PrismicNextLink
                    field={item.jurymember_link}
                    aria-label={`${slice.primary.link_text} – ${asText(item.name)}`}
                  >
                    {slice.primary.link_text}
                  </PrismicNextLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
