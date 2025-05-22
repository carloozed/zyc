import React from 'react';

import styles from './TermineContent.module.css';

import { TeilnahmeTermineDocument } from '../../../../prismicio-types';
import { PrismicRichText, SliceZone } from '@prismicio/react';
import { components } from '@/slices';

type Props = { page: TeilnahmeTermineDocument };

export default function TermineContent({ page }: Props) {
  return (
    <section className={styles.container}>
      <div className={styles.termine__hero}>
        <PrismicRichText field={page.data.page_title} />
      </div>
      <div className={styles.termine__content}>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </section>
  );
}
