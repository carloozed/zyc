import { FC } from 'react';
import { asText, Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

import { PrismicNextImage } from '@prismicio/next';
import styles from './index.module.css';

/**
 * Props for `SplitVisualHeadline`.
 */
export type SplitVisualHeadlineProps =
  SliceComponentProps<Content.SplitVisualHeadlineSlice>;

/**
 * Component for "SplitVisualHeadline" Slices.
 */
const SplitVisualHeadline: FC<SplitVisualHeadlineProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.heroslice}
    >
      <div
        className={styles.heroslice__container}
        style={{ backgroundColor: slice.primary.background_color || '#FFD700' }}
      >
        <div className={styles.heroslice__leftcontainer}>
          <div className={styles.leftcontainer__imagecontainer}>
            <PrismicNextImage field={slice.primary.visual} />
            <div className={styles.imagecontainer__decoration}>
              <PrismicNextImage field={slice.primary.decoration} />
            </div>
          </div>
        </div>
        <div className={styles.heroslice__rightcontainer}>
          <PrismicRichText field={slice.primary.headline} />

          <h3>{asText(slice.primary.supporting_text)}</h3>
        </div>
      </div>
    </section>
  );
};

export default SplitVisualHeadline;
