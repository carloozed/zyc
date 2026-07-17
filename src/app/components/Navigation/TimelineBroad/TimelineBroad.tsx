'use client';

import React, { useState, useEffect } from 'react';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import { usePathname } from 'next/navigation';

import styles from './TimelineBroad.module.css';
import useHideOnScroll from '@/app/components/Navigation/useHideOnScroll';

export default function TimelineBroad({ ...timelineProps }) {
  const timeline = timelineProps.timelineBroad;

  const [isHome, setIsHome] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const showTimeline = useHideOnScroll();

  const pathname = usePathname();

  useEffect(() => {
    const notVisiblePathname = ['/magazin', '/galerie'];
    const shouldHide =
      notVisiblePathname.some((path) => pathname.includes(path)) ||
      pathname.match(/^\/[a-z]{2}$/);

    setIsTimelineVisible(!shouldHide);
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);
  const currentDate = new Date().toISOString().split('T')[0];
  const timelineDate =
    timeline.data.timeline_is_shown_at?.split('T')[0] ||
    timeline.data.timeline_is_shown_at;

  return (
    <>
      {currentDate >= timelineDate && (
        <div
          className={`${styles.timeline__container} ${isHome ? styles.timeline__container__ishome : ''} ${!showTimeline || !isTimelineVisible ? styles.timeline__hidden : ''}`}
        >
          <SliceZone slices={timeline.data.slices} components={components} />
        </div>
      )}
    </>
  );
}
