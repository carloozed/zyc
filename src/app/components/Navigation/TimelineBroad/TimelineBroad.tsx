'use client';

import React, { useState, useEffect } from 'react';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import { usePathname } from 'next/navigation';

import styles from './TimelineBroad.module.css';

export default function TimelineBroad({ ...timelineProps }) {
  const timeline = timelineProps.timelineBroad;

  const [isHome, setIsHome] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 100) {
      setShowTimeline(true);
    } else {
      // Check scroll direction
      if (currentScrollY > lastScrollY) {
        if (currentScrollY > 100) {
          setShowTimeline(false);
        }
      } else {
        if (lastScrollY - currentScrollY >= 30) {
          setShowTimeline(true);
        }
      }
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    let ticking = false;

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
  }, [lastScrollY]);

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);

  return (
    <div
      className={`${styles.timeline__container} ${isHome ? styles.timeline__container__ishome : ''} ${!showTimeline ? styles.timeline__hidden : ''}`}
    >
      <SliceZone slices={timeline.data.slices} components={components} />
    </div>
  );
}
