import React from 'react';
import { JuryGridSlice } from '@/prismicio-types';

import styles from './JuryContent.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = { slice: JuryGridSlice };

export default function JuryContent({ slice }: Props) {
  return (
    <section
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
