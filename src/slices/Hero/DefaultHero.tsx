'use client';

import { PrismicNextImage } from '@prismicio/next';

import React from 'react';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { RevealText } from '@/app/components/RevealText/RevealText';

export default function DefaultHero({ ...defaultHeroProps }) {
  const { slice, styles } = defaultHeroProps;
  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || '#FFD700' }}
      >
        <div className={styles.heroslice__leftcontainer}>
          <FadeIn className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage field={slice.primary.visual} />
            <div className={styles.imagecontainer__decoration}>
              <PrismicNextImage field={slice.primary.decoration} />
            </div>
          </FadeIn>
        </div>
        <div className={styles.heroslice__rightcontainer}>
          <RevealText
            field={slice.primary.headline}
            className={styles.revealtext}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.2}
            as={'h1'}
          />
          <RevealText
            field={slice.primary.supporting_text}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.6}
            as={'h3'}
          />
        </div>
      </div>
    </>
  );
}
