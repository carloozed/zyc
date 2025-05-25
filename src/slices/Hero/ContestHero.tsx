import React from 'react';

import { RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

import { RevealText } from '@/app/components/RevealText/RevealText';

export default function ContestHero({ ...contestHeroProps }) {
  const { slice, styles, signuplink } = contestHeroProps;

  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || '#FFD700' }}
      >
        <div className={styles.heroslice__informationcontainer}>
          {slice.primary.contestubersicht.map(
            (item: { item: RichTextField }, index: number) => (
              <div key={index}>
                <PrismicRichText field={item.item} />
              </div>
            )
          )}
        </div>
        <div className={styles.heroslice__leftcontainer}>
          <div className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage field={slice.primary.visual} />{' '}
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
          <div className={styles.leftcontainer__linkcontainer}>
            <PrismicNextLink field={signuplink.data.anmeldelink} />
            <PrismicNextLink field={slice.primary.reglement_download} />
          </div>
        </div>
        <div className={styles.heroslice__rightcontainer}>
          <RevealText
            field={slice.primary.headline}
            className={styles.revealtext}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.5}
            as={'h1'}
          />
          <RevealText
            field={slice.primary.supporting_text}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.8}
            as={'h3'}
          />
        </div>
      </div>
    </>
  );
}
