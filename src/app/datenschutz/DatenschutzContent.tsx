import React from 'react';

import styles from '../impressum/ImpressumContent.module.css';

import { DatenschutzDocument } from '../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';

import { RevealText } from '../components/RevealText/RevealText';

type Props = {
  page?: DatenschutzDocument;
};

export default function ImpressumContent({ page }: Props) {
  return (
    <div className={styles.main}>
      <RevealText
        field={page?.data.title}
        useScrollTrigger={true}
        as={'h1'}
        staggerAmount={0}
        duration={1.8}
      />

      <div className={styles.content}>
        {page?.data.datenschutz_content.map((item, index) => (
          <div key={index} className={styles.contentItem}>
            <RevealText
              field={item.title}
              useScrollTrigger={true}
              as={'h2'}
              staggerAmount={0}
            />

            <PrismicRichText field={item.text} />
          </div>
        ))}
      </div>
    </div>
  );
}
