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
  IsdownloadsmutedDocument,
} from '../../../prismicio-types';

import { Query } from '@prismicio/client';

type Props = {
  wearehereicon: WeAreHereImageDocument<string>;
  disciplinetypes: CriteriatypesubfieldDocument<string>[];
  signuplink: AnmeldelinkDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  page: TheContestDocument<string>;
  isDownloadsMuted?: Query<IsdownloadsmutedDocument<string>>;
};

export default function ContestContent({
  wearehereicon,
  disciplinetypes,
  signuplink,
  foldoutElements,
  page,
  isDownloadsMuted,
}: Props) {
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
          isDownloadsMuted,
        }}
      />
    </section>
  );
}
