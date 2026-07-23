import React from 'react';

import styles from './ImpressumDatenschutzContainer.module.css';

import { RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

import { RevealText } from '../../components/RevealText/RevealText';

type Props = {
  title: RichTextField;
  items: { title: RichTextField; text: RichTextField }[];
};

export default function ImpressumDatenschutzContainer({ title, items }: Props) {
  return (
    <div className={`page-container ${styles.main}`}>
      <RevealText
        field={title}
        useScrollTrigger={true}
        as={'h1'}
        staggerAmount={0}
        duration={1.8}
      />

      <div className={styles.content}>
        {items.map((item, index) => (
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
