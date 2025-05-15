import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import FoldoutContent from './FoldoutContent';

/**
 * Props for `Foldout`.
 */
export type FoldoutProps = SliceComponentProps<Content.FoldoutSlice>;

/**
 * Component for "Foldout" Slices.
 */
const Foldout: FC<FoldoutProps> = ({ slice }) => {
  return <FoldoutContent slice={slice} />;
};

export default Foldout;
