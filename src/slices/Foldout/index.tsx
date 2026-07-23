import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import FoldoutContent from './FoldoutContent';

/**
 * Props for `Foldout`.
 */
export type FoldoutProps = SliceComponentProps<Content.FoldoutSlice>;

type FoldoutSliceContext = {
  foldoutElements: Content.FoldoutelementDocument[];
};

/**
 * Component for "Foldout" Slices.
 */
const Foldout: FC<FoldoutProps> = ({ slice, context }) => {
  const { foldoutElements } = context as FoldoutSliceContext;

  const regularProps = {
    slice,
    foldoutElements,
  };

  return <FoldoutContent regularProps={regularProps} />;
};

export default Foldout;
