import { FC } from 'react';
import { Content, DateField } from '@prismicio/client';
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
  // Calculate percentage based on dates
  const calculateProgressPercentage = () => {
    const startDateField: DateField = slice.primary.start_date;
    const endDateField: DateField = slice.primary.end_date;

    // Check if date fields exist and have values
    if (!startDateField || !endDateField) {
      return 0; // Return 0% if either date is missing
    }

    // Parse dates - using the string value from the DateField
    const startDate = new Date(startDateField);
    const endDate = new Date(endDateField);

    // Get current date
    const currentDate = new Date();

    // Make sure dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0; // If dates are invalid, return 0%
    }

    // Calculate total duration in milliseconds
    const totalDuration = endDate.getTime() - startDate.getTime();

    // If duration is 0 or negative, return 0
    if (totalDuration <= 0) {
      return 0;
    }

    // Calculate elapsed time
    const elapsedTime = Math.min(
      Math.max(0, currentDate.getTime() - startDate.getTime()),
      totalDuration
    );

    // Calculate percentage (0 to 100)
    return (elapsedTime / totalDuration) * 100;
  };

  // Get the progress percentage
  const progressPercentage = calculateProgressPercentage();

  console.log(
    'startDates',
    slice.primary.start_date,
    'endDates',
    slice.primary.end_date,
    'progressPercentage',
    progressPercentage
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
        <div
          className={styles.progresscontainer__progressbar}
          style={{ width: `${progressPercentage}%` }}
        >
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
