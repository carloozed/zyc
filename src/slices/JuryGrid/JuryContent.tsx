import React from 'react';
import { JuryGridSlice } from '../../../prismicio-types';

import styles from './JuryContent.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

type Props = { slice: JuryGridSlice };

export default function JuryContent({ slice }: Props) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.jury__sectioncontainer}
    >
      <PrismicRichText field={slice.primary.headline} />
      <div className={styles.jury__introduction}>
        <PrismicRichText field={slice.primary.introduction} />
      </div>
      <div className={styles.jury__members}>
        {slice.primary.members.map((item, index) => (
          <div key={index} className={styles.jury__member}>
            <div>
              <div className={styles.jury__container}>
                <div className={styles.jury__uppercontainer}>
                  <PrismicNextImage field={item.photo} />
                  <PrismicRichText field={item.bio} />
                </div>
                <div className={styles.jury__lowercontainer}>
                  <PrismicRichText field={item.name} />
                  <PrismicNextLink field={item.jurymember_link}>
                    <div className={styles.jury__linkimagecontainer}>
                      <PrismicNextImage
                        field={slice.primary.jurymember_linkicon}
                      />
                    </div>
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
