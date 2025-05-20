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

type ContestHeroContext = {
  signuplink: Content.AnmeldelinkDocument;
  wearehereicon: Content.WeAreHereImageDocument;
  disciplinetypes: Content.CriteriatypesubfieldDocument[];
};

/**
 * Component for "SplitVisualHeadline" Slices.
 */
const SplitVisualHeadline: FC<SplitVisualHeadlineProps> = ({
  slice,
  context,
}) => {
  const { signuplink } = context as ContestHeroContext;
  const defaultHeroProps = {
    slice,
    styles,
  };

  const contestHeroProps = {
    slice,
    styles,
    signuplink,
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
