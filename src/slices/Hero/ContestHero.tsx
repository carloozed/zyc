import React from 'react';

import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';

import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  slice: Content.SplitVisualHeadlineSlice;
  styles: Readonly<Record<string, string>>;
};

export default function ContestHero({ slice, styles }: Props) {
  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{
          backgroundColor:
            slice.primary.background_color || 'var(--cadenzagold)',
        }}
      >
        <div className={styles.heroslice__leftcontainer}>
          <div className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage
              field={slice.primary.visual}
              sizes="(max-width: 48rem) 92vw, (max-width: 74rem) and (orientation: portrait) 92vw, (max-width: 74rem) 45vw, 36vw"
              priority
            />{' '}
            <div
              className={styles.imagecontainer__decoration}
              style={{
                position: 'absolute',
                top: '101%',
                height: 'fit-content',
              }}
            >
              <PrismicNextImage field={slice.primary.decoration} />
            </div>
          </div>
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
            delay={1.3}
            as={'h3'}
          />
        </div>
      </div>
    </>
  );
}
