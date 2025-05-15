import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContestTimeline`.
 */
export type ContestTimelineProps =
  SliceComponentProps<Content.ContestTimelineSlice>;

/**
 * Component for "ContestTimeline" Slices.
 */
const ContestTimeline: FC<ContestTimelineProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for contest_timeline (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ContestTimeline;
