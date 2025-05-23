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

    // If we're at the very top, always show timeline
    if (currentScrollY <= 100) {
      setShowTimeline(true);
    } else {
      // Check scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide timeline after 100px
        if (currentScrollY > 100) {
          setShowTimeline(false);
        }
      } else {
        // Scrolling up - show timeline if scrolled up by at least 30px
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
      className={`${styles.timeline__container} ${isHome ? styles.timeline__container__ishome : ''}`}
      style={{
        transform: `translateY(${showTimeline ? '0' : '150%'})`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <SliceZone slices={timeline.data.slices} components={components} />
    </div>
  );
}
