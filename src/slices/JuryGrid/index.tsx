import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import JuryContent from './JuryContent';

/**
 * Props for `JuryGrid`.
 */
export type JuryGridProps = SliceComponentProps<Content.JuryGridSlice>;

/**
 * Component for "JuryGrid" Slices.
 */
const JuryGrid: FC<JuryGridProps> = ({ slice }) => {
  return <JuryContent slice={slice} />;
};

export default JuryGrid;
