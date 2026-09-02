'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { usePathname } from 'next/navigation';
import styles from './ScrollIndicator.module.css';
import stripLocale from '@/helpers/stripLocale';

gsap.registerPlugin(DrawSVGPlugin, SplitText);

// Pages where the indicator never shows.
const EXCLUDED_PAGES = [
  '/',
  '/ueber_zyc',
  '/impressum',
  '/datenschutz',
  '/newsletter_confirmed',
];

const INITIAL_DELAY = 2000; // ms after a page load or route change
const RETURN_DELAY = 1000; // ms after scrolling back up to the top
const TOP_THRESHOLD = 2; // px; tolerates sub-pixel and overscroll values
const HIDE_SPEED = 1.5; // the retrace plays a bit faster than the entrance

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const pathname = usePathname();
  const isExcludedPage = EXCLUDED_PAGES.includes(stripLocale(pathname));

  // One timeline for both directions: showing plays it forward, hiding plays
  // it backwards. An interrupted entrance therefore retraces its own steps
  // instead of being cut off, and the two directions hand over mid-way.
  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const arrow = arrowRef.current;
    if (!container || !text || !arrow) return;

    const split = new SplitText(text, { type: 'chars' });
    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        container.style.visibility = 'hidden';
      },
    });
    // The arrow is the last thing to finish, so the retrace starts with it
    // visibly undrawing instead of idling in the letters' faded-in tail.
    tl.fromTo(
      split.chars,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.06 },
      0,
    ).fromTo(
      arrow,
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 0.5, ease: 'power2.in' },
      '>-0.5',
    );
    timelineRef.current = tl;

    return () => {
      tl.kill();
      split.revert();
      timelineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const tl = timelineRef.current;
    if (!container || !tl) return;

    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const cancelShow = () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
    };

    const isAtTop = () => window.scrollY <= TOP_THRESHOLD;
    const canScroll = () =>
      document.documentElement.scrollHeight >
      window.innerHeight + TOP_THRESHOLD;
    const isHiddenOrHiding = () => tl.reversed() || tl.progress() === 0;

    // Pages can opt out by rendering any element with this attribute
    // (the 404 page does): the hint would only point at the footer there.
    const pageOptsOut = () =>
      document.querySelector('[data-hide-scroll-indicator]') !== null;

    const show = () => {
      showTimer = null;
      if (!isAtTop() || !canScroll() || pageOptsOut()) return;
      container.style.visibility = 'visible';
      tl.timeScale(1).play();
    };

    const scheduleShow = (delay: number) => {
      cancelShow();
      showTimer = setTimeout(show, delay);
    };

    const hide = () => {
      cancelShow();
      tl.timeScale(HIDE_SPEED).reverse();
    };

    // Every route starts hidden; offer the hint once the visitor has had a
    // moment to look at the page, provided they are still at the top.
    tl.pause(0);
    container.style.visibility = 'hidden';
    if (isExcludedPage) return;

    scheduleShow(INITIAL_DELAY);

    const onScroll = () => {
      if (!isAtTop()) {
        hide();
      } else if (!showTimer && isHiddenOrHiding()) {
        scheduleShow(RETURN_DELAY);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelShow();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname, isExcludedPage]);

  return (
    <div ref={containerRef} className={styles.indicator} aria-hidden="true">
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
