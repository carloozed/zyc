'use client';

import React, { useState, useEffect } from 'react';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import { usePathname } from 'next/navigation';

import styles from './TimelineBroad.module.css';

export default function TimelineBroad({ ...timelineProps }) {
  const timeline = timelineProps.timelineBroad;

  const [isHome, setIsHome] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);

  return (
    <div
      className={`${styles.timeline__container} ${isHome ? styles.timeline__container__ishome : ''}`}
    >
      <SliceZone slices={timeline.data.slices} components={components} />{' '}
    </div>
  );
}
