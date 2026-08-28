'use client';

import React from 'react';
import { components } from '@/slices';

import { SliceZone } from '@prismicio/react';
import {
  AnmeldelinkDocument,
  ContactAndDownloadsDocument,
  CriteriatypesubfieldDocument,
  FoldoutelementDocument,
  TheContestDocument,
  WeAreHereImageDocument,
  IsdownloadsmutedDocument,
} from '@/prismicio-types';

import { Query } from '@prismicio/client';

type Props = {
  wearehereicon: WeAreHereImageDocument<string>;
  disciplinetypes: CriteriatypesubfieldDocument<string>[];
  signuplink: AnmeldelinkDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  page: TheContestDocument<string>;
  isDownloadsMuted?: Query<IsdownloadsmutedDocument<string>>;
  contactAndDownloads: ContactAndDownloadsDocument<string> | null;
};

export default function ContestContent({
  wearehereicon,
  disciplinetypes,
  signuplink,
  foldoutElements,
  page,
  isDownloadsMuted,
  contactAndDownloads,
}: Props) {
  return (
    <section className="page-container" style={{ position: 'relative' }}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{
          lang: page.lang,
          wearehereicon,
          disciplinetypes,
          signuplink,
          foldoutElements,
          isDownloadsMuted,
          contactAndDownloads,
        }}
      />
    </section>
  );
}
