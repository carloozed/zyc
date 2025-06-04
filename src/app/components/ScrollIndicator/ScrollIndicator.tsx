'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import styles from './ScrollIndicator.module.css';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(DrawSVGPlugin, SplitText);

export default function ScrollIndicator() {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const textRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const pathname = usePathname();
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pages where indicator should never show
  const excludedPages = ['/', '/ueber_zyc', '/impressum', '/datenschutz'];
  const isExcludedPage = excludedPages.includes(pathname);

  useEffect(() => {
    // Reset state when pathname changes
    setShouldShow(false);
    setHasAnimatedIn(false);

    // Clear any pending animations
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isExcludedPage) {
      return;
    }

    const checkInitialPosition = () => {
      if (window.scrollY === 0) {
        animationTimeoutRef.current = setTimeout(() => {
          setShouldShow(true);
        }, 2000);
      }
    };

    setTimeout(checkInitialPosition, 100);
  }, [pathname, isExcludedPage]);

  useEffect(() => {
    if (isExcludedPage) return;

    const handleScroll = () => {
      const isAtTop = window.scrollY === 0;

      if (isAtTop && !shouldShow && !hasAnimatedIn) {
        // User scrolled back to top - show indicator after delay
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        animationTimeoutRef.current = setTimeout(() => {
          setShouldShow(true);
        }, 1000);
      } else if (!isAtTop && shouldShow) {
        // User scrolled away from top - hide immediately
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }
        setShouldShow(false);
        setHasAnimatedIn(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [shouldShow, hasAnimatedIn, isExcludedPage]);

  useEffect(() => {
    if (shouldShow && !hasAnimatedIn) {
      animateIn();
      setHasAnimatedIn(true);

      // Auto-hide after 5 seconds
      animationTimeoutRef.current = setTimeout(() => {
        animateOut();
        setShouldShow(false);
        setHasAnimatedIn(false);
      }, 5000);
    } else if (!shouldShow && hasAnimatedIn) {
      animateOut();
      setHasAnimatedIn(false);
    }
  }, [shouldShow, hasAnimatedIn]);

  const animateIn = () => {
    if (!textRef.current || !arrowRef.current) return;

    // Clean up previous split
    if (splitRef.current) {
      splitRef.current.revert();
    }

    splitRef.current = new SplitText(textRef.current, { type: 'chars' });

    // Set initial states
    gsap.set(splitRef.current.chars, { y: '100%', opacity: 0 });
    gsap.set(arrowRef.current, { drawSVG: '0%' });

    // Animate in
    gsap.to(splitRef.current.chars, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.06,
    });

    gsap.to(arrowRef.current, {
      duration: 0.5,
      drawSVG: '100%',
      ease: 'power2.in',
      delay: 0.3,
    });
  };

  const animateOut = () => {
    if (!textRef.current || !arrowRef.current) return;

    // Ensure we have split text
    if (!splitRef.current || !splitRef.current.chars?.length) {
      splitRef.current = new SplitText(textRef.current, { type: 'chars' });
    }

    // Animate out
    gsap.to(splitRef.current.chars, {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.03,
    });

    gsap.to(arrowRef.current, {
      duration: 0.5,
      drawSVG: '0%',
      ease: 'power2.in',
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, []);

  return (
    <div
      style={{ display: shouldShow ? 'flex' : 'none' }}
      className={styles.indicator}
    >
      <div className={styles.indicator__uppercontainer}>
        <h3 ref={textRef}>scroll</h3>
      </div>
      <svg
        width="24"
        height="60"
        viewBox="0 0 24 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={arrowRef}
          d="M9.71639 0.843296C31.8731 28.3434 26.9544 66.3811 2.0756 88.0743L2.84384 88.9948L0.000198747 89.4893L0.994071 86.7793L1.75548 87.6902C26.4331 66.1648 31.3057 28.4361 9.32709 1.15696L9.71639 0.843296Z"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
