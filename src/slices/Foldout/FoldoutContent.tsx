import React from 'react';
import {
  AnmeldelinkDocument,
  FoldoutelementDocument,
  FoldoutSlice,
} from '../../../prismicio-types';
import RegularSlice from './RegularSlice/RegularSlice';

import styles from './FoldoutContent.module.css';

// Export the type so it can be imported in child components
export type regularPropsType = {
  slice: FoldoutSlice;
  foldoutElements: FoldoutelementDocument[];
  signuplink: AnmeldelinkDocument; // Changed from FoldoutSlice to AnmeldelinkDocument
};

export default function FoldoutContent({
  regularProps,
}: {
  regularProps: regularPropsType;
}) {
  const { slice } = regularProps;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.foldout__container}
    >
      {slice.variation === 'default' && (
        <RegularSlice regularProps={regularProps} />
      )}
      {/* {slice.variation === 'another' && (
        <AnotherComponent regularProps={regularProps} />
      )} */}
    </section>
  );
}
