'use client';

import { SliceZone } from '@prismicio/react';
import React from 'react';
import { components } from '@/slices';
import {
  FoldoutelementDocument,
  UberZycDocument,
} from '../../../../../prismicio-types';

// import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  styles: { [key: string]: string };
  page: UberZycDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
};

export default function AboutContent({ styles, page, foldoutElements }: Props) {
  return (
    <section className={styles.about__container}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements }}
      />
    </section>
  );
}
