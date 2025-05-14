import React from 'react';

import { asText } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

import { PrismicNextImage } from '@prismicio/next';

export default function ContestHero({ ...contestHeroProps }) {
  const { slice, styles } = contestHeroProps;
  return (
    <>
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || '#FFD700' }}
      >
        <div className={styles.heroslice__leftcontainer}>
          <div className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage field={slice.primary.visual} />
            <div className={styles.imagecontainer__decoration}>
              <PrismicNextImage field={slice.primary.decoration} />
            </div>
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
