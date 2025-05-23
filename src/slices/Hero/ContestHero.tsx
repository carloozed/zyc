import React from 'react';

import { asText, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

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
          <PrismicRichText field={slice.primary.headline} />
          <h3>{asText(slice.primary.supporting_text)}</h3>
        </div>
      </div>
    </>
  );
}
