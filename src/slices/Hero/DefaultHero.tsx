import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';

import React from 'react';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  slice: Content.SplitVisualHeadlineSlice;
  styles: Readonly<Record<string, string>>;
};

export default function DefaultHero({ slice, styles }: Props) {
  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || 'var(--cadenzagold)' }}
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
            delay={0.8}
            as={'h1'}
          />
          <RevealText
            field={slice.primary.supporting_text}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.0}
            as={'h3'}
          />
        </div>
      </div>
    </>
  );
}
