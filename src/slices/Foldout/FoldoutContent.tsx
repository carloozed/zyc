import { FoldoutSliceFoldoutWithImage } from '@/prismicio-types';

import RegularSlice from './RegularSlice/RegularSlice';
import ImageSlice from './ImageSlice/ImageSlice';

import { ImageSliceProps, RegularSliceProps } from './types';

import styles from './FoldoutContent.module.css';

export default function FoldoutContent({
  regularProps,
}: {
  regularProps: RegularSliceProps;
}) {
  const { slice, foldoutElements, signuplink } = regularProps;

  const imageSliceProps: ImageSliceProps = {
    slice: slice as FoldoutSliceFoldoutWithImage,
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
