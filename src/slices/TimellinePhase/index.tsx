import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TimelinePhases`.
 */
export type TimelinePhasesProps =
  SliceComponentProps<Content.TimelinePhasesSlice>;

/**
 * Component for "TimelinePhases" Slices.
 */
const TimelinePhases: FC<TimelinePhasesProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for timeline_phases (variation: {slice.variation})
      Slices
    </section>
  );
};

export default TimelinePhases;
