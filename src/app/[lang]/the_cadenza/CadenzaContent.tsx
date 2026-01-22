'use client';

import React from 'react';
import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';

import {
  AnmeldelinkDocument,
  FoldoutelementDocument,
  TheCadenzaDocument,
} from '../../../../prismicio-types';

type Props = {
  page: TheCadenzaDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  signuplink: AnmeldelinkDocument;
};

export default function CadenzaContent({
  page,
  foldoutElements,
  signuplink,
}: Props) {
  return (
    <section style={{ position: 'relative' }}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements, signuplink }}
      />
    </section>
  );
}
