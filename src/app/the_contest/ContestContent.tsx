'use client';

import React from 'react';
import { components } from '@/slices';

import { SliceZone } from '@prismicio/react';
import {
  AnmeldelinkDocument,
  CriteriatypesubfieldDocument,
  FoldoutelementDocument,
  TheContestDocument,
  WeAreHereImageDocument,
} from '../../../prismicio-types';

import { useRevealer } from '@/hooks/useRevealer';

type Props = {
  wearehereicon: WeAreHereImageDocument<string>;
  disciplinetypes: CriteriatypesubfieldDocument<string>[];
  signuplink: AnmeldelinkDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  page: TheContestDocument<string>;
};

export default function ContestContent({
  wearehereicon,
  disciplinetypes,
  signuplink,
  foldoutElements,
  page,
}: Props) {
  useRevealer();

  return (
    <section style={{ position: 'relative' }}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{
          wearehereicon,
          disciplinetypes,
          signuplink,
          foldoutElements,
        }}
      />
    </section>
  );
}
