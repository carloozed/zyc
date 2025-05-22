import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import ScheduleContent from './components/ScheduleContent';

/**
 * Props for `ScheduleSlice`.
 */
export type ScheduleSliceProps =
  SliceComponentProps<Content.ScheduleSliceSlice>;

/**
 * Component for "ScheduleSlice" Slices.
 */
const ScheduleSlice: FC<ScheduleSliceProps> = ({ slice }) => {
  return <ScheduleContent slice={slice} />;
};

export default ScheduleSlice;
