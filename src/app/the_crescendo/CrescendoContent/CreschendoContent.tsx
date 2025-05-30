'use client';

import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';
import React from 'react';
import {
  FoldoutelementDocument,
  TheCrescendoDocument,
} from '../../../../prismicio-types';

type Props = {
  page: TheCrescendoDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
};

export default function CreschendoContent({ page, foldoutElements }: Props) {
  return (
    <section>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements }}
      />
    </section>
  );
}
