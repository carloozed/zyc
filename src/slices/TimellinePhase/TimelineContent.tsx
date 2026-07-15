'use client';

import { PrismicRichText } from '@prismicio/react';
import React from 'react';
import { TimelinePhasesSlice } from '@/prismicio-types';

import { useMobile } from '@/contexts/MobileContext';
import useDateRangeProgress from '@/helpers/useDateRangeProgress';

type Props = {
  styles: Readonly<Record<string, string>>;
  slice: TimelinePhasesSlice;
};

const CONTAINER_WIDTHS: Record<
  TimelinePhasesSlice['variation'],
  { desktop: string; mobile: string }
> = {
  default: { desktop: '100%', mobile: '100%' },
  midPhase: { desktop: '17.5%', mobile: '24%' },
  shortPhase: { desktop: '10%', mobile: '18%' },
};

function ProgressArrow() {
  return (
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
  );
}

export default function TimelineContent({ styles, slice }: Props) {
  const { isMobile } = useMobile();

  const progressPercentage = useDateRangeProgress(
    slice.primary.start_date,
    slice.primary.end_date,
  );

  const containerWidth =
    CONTAINER_WIDTHS[slice.variation][isMobile ? 'mobile' : 'desktop'];

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.timeline__container}
      style={{ width: containerWidth }}
    >
      <div>
        <div className={styles.timeline__titlecontainer}>
          <PrismicRichText field={slice.primary.phase_title} />
        </div>
        <div className={styles.timeline__progresscontainer}>
          <div className={styles.progresscontainer__circle}></div>
          <div className={styles.progresscontainer__circle}></div>
          <div
            className={styles.progresscontainer__progressbar}
            style={{ width: `${progressPercentage}%` }}
          >
            <ProgressArrow />
          </div>
        </div>
      </div>
    </div>
  );
}
