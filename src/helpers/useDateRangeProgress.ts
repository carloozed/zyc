'use client';

import { useEffect, useState } from 'react';
import { DateField, TimestampField } from '@prismicio/client';

// Percentage (0–100) of the time between start and end that has already
// elapsed, clamped to the range. Returns 0 for missing/invalid dates or
// when end is not after start.
export const getDateRangeProgress = (
  start: DateField | TimestampField,
  end: DateField | TimestampField,
): number => {
  if (!start || !end) return 0;

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (isNaN(startTime) || isNaN(endTime)) return 0;

  const totalDuration = endTime - startTime;
  if (totalDuration <= 0) return 0;

  const elapsed = Math.min(Math.max(0, Date.now() - startTime), totalDuration);

  return (elapsed / totalDuration) * 100;
};

// Computed in an effect (not during render) so server-rendered HTML is
// always 0% and never mismatches the client's clock on hydration.
const useDateRangeProgress = (
  start: DateField | TimestampField,
  end: DateField | TimestampField,
): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getDateRangeProgress(start, end));
  }, [start, end]);

  return progress;
};

export default useDateRangeProgress;
