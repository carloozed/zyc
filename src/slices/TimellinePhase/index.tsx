import { FC } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

import styles from './index.module.css';

/**
 * Props for `TimelinePhases`.
 */
export type TimelinePhasesProps =
  SliceComponentProps<Content.TimelinePhasesSlice>;

/**
 * Component for "TimelinePhases" Slices.
 */
const TimelinePhases: FC<TimelinePhasesProps> = ({ slice }) => {
  console.log(
    'startDates',
    slice.primary.start_date,
    'endDates',
    slice.primary.end_date
  );

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.timeline__container}
      style={{
        width:
          slice.variation === 'default'
            ? '22.5%'
            : slice.variation === 'midPhase'
              ? '17.5%'
              : '10%',
      }}
    >
      <div className={styles.timeline__titlecontainer}>
        <PrismicRichText field={slice.primary.phase_title} />
      </div>{' '}
      <div className={styles.timeline__progresscontainer}>
        <div className={styles.progresscontainer__circle}></div>
        <div className={styles.progresscontainer__circle}></div>
        <div className={styles.progresscontainer__progressbar}>
          <svg
            width="100%"
            height="6"
            viewBox="0 0 314 6"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M314 3.00003L309 5.88678L309 0.113275L314 3.00003ZM0 2.99997L8.71863e-08 2.49997L309.5 2.50003L309.5 3.00003L309.5 3.50003L-8.71815e-08 3.49997L0 2.99997Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TimelinePhases;
