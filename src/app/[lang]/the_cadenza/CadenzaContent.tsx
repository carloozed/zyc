'use client';

import React from 'react';
import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';

import {
  AnmeldelinkDocument,
  ContactAndDownloadsDocument,
  FoldoutelementDocument,
  TheCadenzaDocument,
} from '@/prismicio-types';

type Props = {
  page: TheCadenzaDocument<string>;
  foldoutElements: FoldoutelementDocument<string>[];
  signuplink: AnmeldelinkDocument;
  contactAndDownloads: ContactAndDownloadsDocument | null;
};

export default function CadenzaContent({
  page,
  foldoutElements,
  signuplink,
  contactAndDownloads,
}: Props) {
  return (
    <section className="page-container" style={{ position: 'relative' }}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ foldoutElements, signuplink, contactAndDownloads }}
      />
    </section>
  );
}
