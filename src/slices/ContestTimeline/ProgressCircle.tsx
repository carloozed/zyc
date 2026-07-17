import React, { useRef } from 'react';

import {
  ContestTimelineSliceDefaultPrimaryTimelineContestGroupItem,
  Simplify,
} from '@/prismicio-types';
import useDateRangeProgress from '@/helpers/useDateRangeProgress';

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
  const circleRef = useRef<HTMLDivElement>(null);

  const progressPercentage = useDateRangeProgress(
    item.start_date,
    item.end_date,
  );

  useGSAP(
    () => {
      gsap.set(circleRef.current, { y: '150%' });

      // Create scroll trigger animation
      gsap.to(circleRef.current, {
        y: '0%',
        duration: 1.2,
        ease: 'power3.out',
        delay: delay || 0,
        scrollTrigger: {
          trigger: circleRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
        },
      });
    },
    { scope: circleRef },
  );

  return (
    <div
      ref={circleRef}
      className={styles.color}
      style={{ opacity: `${progressPercentage}%` }}
    ></div>
  );
}
