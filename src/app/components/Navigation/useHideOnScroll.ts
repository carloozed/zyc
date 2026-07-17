'use client';

import { useEffect, useRef, useState } from 'react';

// Visible near the top of the page (within 100px) or while scrolling up by
// at least 30px; hidden while scrolling down past 100px. Listens on the
// window scroll event, throttled to one check per animation frame.
const useHideOnScroll = (): boolean => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 100) {
        setVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current) {
          if (currentScrollY > 100) {
            setVisible(false);
          }
        } else {
          if (lastScrollY.current - currentScrollY >= 30) {
            setVisible(true);
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

  return visible;
};

export default useHideOnScroll;
