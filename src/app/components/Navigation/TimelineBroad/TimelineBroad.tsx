import React from 'react';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import styles from './TimelineBroad.module.css';

export default function TimelineBroad({ ...timelineProps }) {
  const timeline = timelineProps.timelineBroad;

  console.log(timeline);
  return (
    <div className={styles.timeline__container}>
      <SliceZone slices={timeline.data.slices} components={components} />{' '}
    </div>
  );
}
