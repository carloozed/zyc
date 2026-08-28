import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import JuryContent from './JuryContent';

/**
 * Props for `JuryGrid`.
 */
export type JuryGridProps = SliceComponentProps<
  Content.JuryGridSlice,
  { lang?: string }
>;

/**
 * Component for "JuryGrid" Slices.
 */
const JuryGrid: FC<JuryGridProps> = ({ slice, context }) => {
  return <JuryContent slice={slice} lang={context?.lang} />;
};

export default JuryGrid;
