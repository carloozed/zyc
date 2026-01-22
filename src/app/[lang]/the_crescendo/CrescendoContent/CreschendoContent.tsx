'use client';

import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';
import React from 'react';
import {
  AnmeldelinkDocument,
  FoldoutelementDocument,
  TheCrescendoDocument,
} from '../../../../../prismicio-types';

type Props = {
  page: TheCrescendoDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  signuplink: AnmeldelinkDocument;
};

export default function CreschendoContent({
  page,
  foldoutElements,
  signuplink,
}: Props) {
  return (
    <section>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements, signuplink }}
      />
    </section>
  );
}
