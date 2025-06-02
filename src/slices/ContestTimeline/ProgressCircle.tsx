import React, { useRef } from 'react';

import { useEffect, useState } from 'react';
import { DateField } from '@prismicio/client';
import {
  ContestTimelineSliceDefaultPrimaryTimelineContestGroupItem,
  Simplify,
} from '../../../prismicio-types';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  styles: Readonly<Record<string, string>>;
  item: Simplify<ContestTimelineSliceDefaultPrimaryTimelineContestGroupItem>;
  delay?: number;
};

export default function ProgressCircle({ item, styles, delay }: Props) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateProgressPercentage = () => {
      const startDateField: DateField = item.start_date;
      const endDateField: DateField = item.end_date;

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
  }, [item.start_date, item.end_date]);

  useGSAP(
    () => {
      gsap.set(circleRef.current, { y: '150%' });

      // Create scroll trigger animation
      gsap.to(circleRef.current, {
        y: '0%',
        duration: 1.2,
        ease: 'power3.out',
        delay: delay || 0,
        markers: true,
        scrollTrigger: {
          trigger: circleRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
        },
      });
    },
    { scope: circleRef }
  );

  return (
    <div
      ref={circleRef}
      className={styles.color}
      style={{ opacity: `${progressPercentage}%` }}
    ></div>
  );
}
