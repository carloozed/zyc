'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import styles from './ScrollIndicator.module.css';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(DrawSVGPlugin, SplitText);

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const textRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname === '/' ||
      pathname === '/ueber_zyc' ||
      pathname === '/impressum' ||
      pathname === '/datenschutz'
    ) {
      setIsVisible(false);
    } else {
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
    setHasAnimated(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY === 0 && !hasAnimated) {
        setTimeout(() => {
          animateIn();
          setHasAnimated(true);
        }, 2000);
      } else {
        if (hasAnimated) {
          setTimeout(() => {
            animateOut();
          }, 5000);
        }
      }
    };
    handleScroll();
  }, [hasAnimated]);

  const animateIn = () => {
    if (!textRef.current || !arrowRef.current) return;

    if (splitRef.current) {
      splitRef.current.revert();
    }

    splitRef.current = new SplitText(textRef.current, { type: 'chars' });

    gsap.set(splitRef.current.chars, { y: '100%', opacity: 0 });
    gsap.set(arrowRef.current, { drawSVG: '0%' });

    gsap.to(splitRef.current.chars, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 1.5,
      stagger: 0.06,
    });

    gsap.to(arrowRef.current, {
      duration: 0.5,
      drawSVG: '100%',
      ease: 'power2.in',
      delay: 1.5,
    });
  };

  const animateOut = () => {
    if (!textRef.current || !arrowRef.current) return;

    if (!splitRef.current || !splitRef.current.chars?.length) {
      splitRef.current = new SplitText(textRef.current, { type: 'chars' });
    }

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

  return (
    <div
      style={{ display: isVisible ? 'flex' : 'none' }}
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
