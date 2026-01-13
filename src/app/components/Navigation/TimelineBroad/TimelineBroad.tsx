'use client';

import React, { useState, useEffect, useRef } from 'react';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import { usePathname } from 'next/navigation';

import styles from './TimelineBroad.module.css';

export default function TimelineBroad({ ...timelineProps }) {
  const timeline = timelineProps.timelineBroad;

  const [isHome, setIsHome] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const lastScrollY = useRef(0);

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes('/magazin')) {
      setIsTimelineVisible(true);
    } else {
      setIsTimelineVisible(false);
    }
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 100) {
        setShowTimeline(true);
      } else {
        // Check scroll direction
        if (currentScrollY > lastScrollY.current) {
          if (currentScrollY > 100) {
            setShowTimeline(false);
          }
        } else {
          if (lastScrollY.current - currentScrollY >= 30) {
            setShowTimeline(true);
          }
        }
      }

      lastScrollY.current = currentScrollY;
    };

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

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
