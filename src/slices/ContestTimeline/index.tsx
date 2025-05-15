import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import ContestTimelineContent from './ContestTimelineContent';

/**
 * Props for `ContestTimeline`.
 */
export type ContestTimelineProps =
  SliceComponentProps<Content.ContestTimelineSlice>;

/**
 * Component for "ContestTimeline" Slices.
 */
const ContestTimeline: FC<ContestTimelineProps> = ({ slice }) => {
  return <ContestTimelineContent slice={slice} />;
};

export default ContestTimeline;
