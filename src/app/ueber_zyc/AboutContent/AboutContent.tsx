'use client';

import { PrismicRichText, SliceZone } from '@prismicio/react';
import React from 'react';
import { components } from '@/slices';
import {
  FoldoutelementDocument,
  UberZycDocument,
} from '../../../../prismicio-types';

import { useRevealer } from '@/hooks/useRevealer';

type Props = {
  styles: { [key: string]: string };
  page: UberZycDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
};

export default function AboutContent({ styles, page, foldoutElements }: Props) {
  useRevealer();
  return (
    <section className={styles.about__container}>
      <div className="revealer"></div>
      <PrismicRichText field={page.data.page_title} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements }}
      />
    </section>
  );
}
