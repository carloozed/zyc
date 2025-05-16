import { SliceComponentProps } from '@prismicio/react';
import ContestTimelineContent from './ContestTimelineContent';
import {
  ContestTimelineSlice,
  WeAreHereImageDocument,
} from '../../../prismicio-types';

/**
 * Type for the context that includes our WeAreHereImageDocument
 */
type ContestTimelineContext = {
  wearehereicon: WeAreHereImageDocument;
};

/**
 * Props for `ContestTimeline`.
 */
export type ContestTimelineProps = SliceComponentProps<
  ContestTimelineSlice,
  ContestTimelineContext
>;

/**
 * Component for "ContestTimeline" Slices.
 */
const ContestTimeline = ({ slice, context }: ContestTimelineProps) => {
  // Extract wearehereicon from context
  const { wearehereicon } = context;

  return <ContestTimelineContent slice={slice} wearehereicon={wearehereicon} />;
};

export default ContestTimeline;
