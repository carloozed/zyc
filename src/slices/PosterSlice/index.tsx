import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import PosterSliceContent from './PosterSliceContent';

/**
 * Props for `PosterSlice`.
 */
export type PosterSliceProps = SliceComponentProps<Content.PosterSliceSlice>;

/**
 * Component for "PosterSlice" Slices.
 */
const PosterSlice: FC<PosterSliceProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PosterSliceContent slice={slice} />
    </section>
  );
};

export default PosterSlice;
