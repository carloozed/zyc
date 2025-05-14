import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import styles from './index.module.css';
import DefaultHero from './DefaultHero';
import ContestHero from './ContestHero';

/**
 * Props for `SplitVisualHeadline`.
 */
export type SplitVisualHeadlineProps =
  SliceComponentProps<Content.SplitVisualHeadlineSlice>;

/**
 * Component for "SplitVisualHeadline" Slices.
 */
const SplitVisualHeadline: FC<SplitVisualHeadlineProps> = ({ slice }) => {
  const defaultHeroProps = {
    slice,
    styles,
  };

  const contestHeroProps = {
    slice,
    styles,
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.heroslice}
    >
      {slice.variation === 'visual_left_headline_right' && (
        <DefaultHero {...defaultHeroProps} />
      )}

      {slice.variation === 'contest' && <ContestHero {...contestHeroProps} />}
    </section>
  );
};

export default SplitVisualHeadline;
