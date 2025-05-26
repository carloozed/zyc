'use client';

import React from 'react';

import styles from './TermineContent.module.css';

import { TeilnahmeTermineDocument } from '../../../../prismicio-types';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = { page: TeilnahmeTermineDocument };

export default function TermineContent({ page }: Props) {
  return (
    <section className={styles.container}>
      <div className={styles.termine__hero}>
        <RevealText field={page.data.page_title} as={'h1'} delay={0.7} />
      </div>
      <div className={styles.termine__content}>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </section>
  );
}
