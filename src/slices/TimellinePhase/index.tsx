import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import styles from './index.module.css';
import TimelineContent from './TimelineContent';

/**
 * Props for `TimelinePhases`.
 */
export type TimelinePhasesProps =
  SliceComponentProps<Content.TimelinePhasesSlice>;

/**
 * Component for "TimelinePhases" Slices.
 */
const TimelinePhases: FC<TimelinePhasesProps> = ({ slice }) => {
  return <TimelineContent styles={styles} slice={slice} />;
};

export default TimelinePhases;
