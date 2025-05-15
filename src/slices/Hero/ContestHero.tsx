import React from 'react';

import { asText, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

export default function ContestHero({ ...contestHeroProps }) {
  const { slice, styles } = contestHeroProps;

  console.log('ContestHero slice', slice);

  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || '#FFD700' }}
      >
        <div className={styles.heroslice__informationcontainer}>
          {slice.primary.contestubersicht.map(
            (item: RichTextField, index: number) => (
              <div key={index}>
                <PrismicRichText field={item} />
              </div>
            )
          )}
        </div>
        <div className={styles.heroslice__leftcontainer}>
          <div className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage field={slice.primary.visual} />
          </div>
          <div className={styles.leftcontainer__linkcontainer}>
            <PrismicNextLink field={slice.primary.anmeldelink} />
            <PrismicNextLink field={slice.primary.reglement_download} />
          </div>
        </div>
        <div className={styles.heroslice__rightcontainer}>
          {' '}
          <div className={styles.imagecontainer__decoration}>
            <PrismicNextImage field={slice.primary.decoration} />
          </div>
          <PrismicRichText field={slice.primary.headline} />
          <h3>{asText(slice.primary.supporting_text)}</h3>
        </div>
      </div>
    </>
  );
}
