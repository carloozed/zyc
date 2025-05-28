'use client';

import { PrismicRichText } from '@prismicio/react';
import React, { useState, useEffect } from 'react';
import { DateField } from '@prismicio/client';
import { TimelinePhasesSlice } from '../../../prismicio-types';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  styles: Readonly<Record<string, string>>;
  slice: TimelinePhasesSlice;
};

export default function TimelineContent({ styles, slice }: Props) {
  const [progressPercentage, setProgressPercentage] = useState(0);

  const { isMobile } = useMobile();

  useEffect(() => {
    const calculateProgressPercentage = () => {
      const startDateField: DateField = slice.primary.start_date;
      const endDateField: DateField = slice.primary.end_date;

      if (!startDateField || !endDateField) {
        return 0;
      }

      const startDate = new Date(startDateField);
      const endDate = new Date(endDateField);

      const currentDate = new Date();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 0;
      }

      const totalDuration = endDate.getTime() - startDate.getTime();

      if (totalDuration <= 0) {
        return 0;
      }

      const elapsedTime = Math.min(
        Math.max(0, currentDate.getTime() - startDate.getTime()),
        totalDuration
      );

      return (elapsedTime / totalDuration) * 100;
    };

    setProgressPercentage(calculateProgressPercentage());
  }, [slice.primary.start_date, slice.primary.end_date]);

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.timeline__container}
      style={{
        width:
          slice.variation === 'default'
            ? `${!isMobile ? '22.5%' : '30%'}`
            : slice.variation === 'midPhase'
              ? `${!isMobile ? '17.5%' : '24%'}`
              : `${!isMobile ? '10%' : '18%'}`,
      }}
    >
      <div>
        {' '}
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
    </div>
  );
}
