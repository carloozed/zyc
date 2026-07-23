import React from 'react';
import {
  FoldoutelementDocument,
  FoldoutSlice,
  FoldoutSliceDefault,
  FoldoutSliceFoldoutWithImage,
} from '@/prismicio-types';
import RegularSlice from './RegularSlice/RegularSlice';

import ImageSlice from './ImageSlice/ImageSlice';

import styles from './FoldoutContent.module.css';

export type regularPropsType = {
  slice: FoldoutSliceDefault;
  foldoutElements: FoldoutelementDocument[];
};

export type ImagePropsType = {
  slice: FoldoutSliceFoldoutWithImage;
  foldoutElements: FoldoutelementDocument[];
};
export default function FoldoutContent({
  regularProps,
}: {
  regularProps: {
    slice: FoldoutSlice;
    foldoutElements: FoldoutelementDocument[];
  };
}) {
  const { slice, foldoutElements } = regularProps;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.foldout__container}
    >
      {slice.variation === 'default' && (
        <RegularSlice regularProps={{ slice, foldoutElements }} />
      )}
      {slice.variation === 'foldoutWithImage' && (
        <ImageSlice imageSliceProps={{ slice, foldoutElements }} />
      )}
    </section>
  );
}
