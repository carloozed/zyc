import React from 'react';
import {
  AnmeldelinkDocument,
  FoldoutelementDocument,
  FoldoutSlice,
  FoldoutSliceFoldoutWithImage,
} from '../../../prismicio-types';
import RegularSlice from './RegularSlice/RegularSlice';

import ImageSlice from './ImageSlice/ImageSlice';

import styles from './FoldoutContent.module.css';

// Export the type so it can be imported in child components
export type regularPropsType = {
  slice: FoldoutSlice;
  foldoutElements: FoldoutelementDocument[];
  signuplink: AnmeldelinkDocument; // Changed from FoldoutSlice to AnmeldelinkDocument
};

export type ImagePropsType = {
  slice: FoldoutSliceFoldoutWithImage;
  foldoutElements: FoldoutelementDocument[];
  signuplink: AnmeldelinkDocument;
};
export default function FoldoutContent({
  regularProps,
}: {
  regularProps: regularPropsType;
}) {
  const { slice, foldoutElements, signuplink } = regularProps;

  const imageSliceProps: ImagePropsType = {
    slice: slice as FoldoutSliceFoldoutWithImage, // Type assertion since we check variation before using
    foldoutElements,
    signuplink,
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.foldout__container}
    >
      {slice.variation === 'default' && (
        <RegularSlice regularProps={regularProps} />
      )}
      {slice.variation === 'foldoutWithImage' && (
        <ImageSlice imageSliceProps={imageSliceProps} />
      )}
    </section>
  );
}
