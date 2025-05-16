import React from 'react';

import { useEffect, useState } from 'react';
import { DateField } from '@prismicio/client';
import {
  ContestTimelineSliceDefaultPrimaryTimelineContestGroupItem,
  Simplify,
} from '../../../prismicio-types';

type Props = {
  styles: Readonly<Record<string, string>>;
  item: Simplify<ContestTimelineSliceDefaultPrimaryTimelineContestGroupItem>;
};

export default function ProgressCircle({ item, styles }: Props) {
  const [progressPercentage, setProgressPercentage] = useState(0);

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

  return (
    <div className={styles.color} style={{ opacity: `${progressPercentage}%` }}>
      {progressPercentage === 100 && (
        <p>
          diese phase <br />
          ist vorbei
        </p>
      )}
    </div>
  );
}
