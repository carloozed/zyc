import React from 'react';

import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';

import styles from './Content.module.css';

import { DeinWegDocument } from '../../../../prismicio-types';
type Props = {
  page: DeinWegDocument;
};

export default function Content({ page }: Props) {
  return (
    <div className={styles.container}>
      <SliceZone slices={page.data.slices} components={components} />
    </div>
  );
}
