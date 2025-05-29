'use client';

import React, { useRef, useState, useEffect } from 'react';

import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

import styles from './ScrollIndicator.module.css';

import { usePathname } from 'next/navigation';

gsap.registerPlugin(DrawSVGPlugin, useGSAP);

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const textRefOne = useRef<SVGPathElement>(null);
  const textRefTwo = useRef<SVGPathElement>(null);
  const textRefThree = useRef<SVGPathElement>(null);
  const textRefFour = useRef<SVGPathElement>(null);
  const textRefFive = useRef<SVGPathElement>(null);
  const textRefSix = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/' || pathname === '/ueber_zyc') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
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
        }, 1000);
      } else if (scrollY > 0 && hasAnimated) {
        animateOut();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    if (window.scrollY === 0 && !hasAnimated) {
      setTimeout(() => {
        animateIn();
        setHasAnimated(true);
      }, 1000);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  const animateIn = () => {
    const textRefs = [
      textRefSix,
      textRefFive,
      textRefFour,
      textRefThree,
      textRefTwo,
      textRefOne,
    ];

    gsap.set(
      textRefs.map((ref) => ref.current),
      { drawSVG: '0%' }
    );
    gsap.set(arrowRef.current, { drawSVG: '0%' });

    gsap.to(
      textRefs.map((ref) => ref.current),
      {
        duration: 0.4,
        drawSVG: '100%',
        ease: 'power2.out',
        stagger: 0.2,
      }
    );

    // Animate arrow after text is done
    gsap.to(arrowRef.current, {
      duration: 1,
      drawSVG: '50%',
      ease: 'power2.out',
      delay: textRefs.length * 0.2 + 0.3, // Wait for all text + small buffer
    });
  };

  const animateOut = () => {
    const textRefs = [
      textRefOne,
      textRefTwo,
      textRefThree,
      textRefFour,
      textRefFive,
      textRefSix,
    ]; // Reverse order

    // Animate arrow out first
    gsap.to(arrowRef.current, {
      duration: 0.5,
      drawSVG: '0%',
      ease: 'power2.in',
    });

    // Animate text paths out with stagger (reverse order)
    gsap.to(
      textRefs.map((ref) => ref.current),
      {
        duration: 0.5,
        drawSVG: '0%',
        ease: 'power2.in',
        stagger: 0.1,
        delay: 0.2, // Wait for arrow to start disappearing
      }
    );
  };

  useGSAP(() => {
    // Set initial state - all paths hidden
    const textRefs = [
      textRefOne,
      textRefTwo,
      textRefThree,
      textRefFour,
      textRefFive,
      textRefSix,
    ];
    gsap.set(
      textRefs.map((ref) => ref.current),
      { drawSVG: '0%' }
    );
    gsap.set(arrowRef.current, { drawSVG: '0%' });
  });

  return (
    <div
      style={{ display: isVisible ? 'flex' : 'none' }}
      className={styles.indicator}
    >
      <div className={styles.indicator__uppercontainer}>
        <svg
          width="69"
          height="18"
          viewBox="0 0 69 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M68.4744 17.0002H63.0984V0.680176H68.4744V17.0002Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefOne}
          />
          <path
            d="M62.0525 17.0002H56.6765V0.680176H62.0525V17.0002Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefTwo}
          />
          <path
            d="M48.843 4.75977C53.547 4.75977 55.851 6.43977 55.851 10.9998C55.851 15.5598 53.547 17.2398 48.843 17.2398C44.139 17.2398 41.835 15.5598 41.835 10.9998C41.835 6.43977 44.139 4.75977 48.843 4.75977ZM50.187 10.9998C50.187 8.02377 49.803 7.44777 48.843 7.44777C47.883 7.44777 47.499 8.02377 47.499 10.9998C47.499 13.9758 47.883 14.5518 48.843 14.5518C49.803 14.5518 50.187 13.9758 50.187 10.9998Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefThree}
          />
          <path
            d="M34.2556 16.9998H28.8796V4.99977H34.2556V7.20777H34.2796C34.6636 5.47977 35.6956 4.75977 37.7596 4.75977C40.3516 4.75977 41.4556 6.07977 41.4556 8.88777V10.7598H36.3676V9.55977C36.3676 8.33577 36.1036 8.02377 35.5996 8.02377C34.9276 8.02377 34.2556 8.62377 34.2556 10.9038V16.9998Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefFour}
          />
          <path
            d="M14.6943 10.9998C14.6943 6.43977 16.9263 4.75977 21.4623 4.75977C25.6383 4.75977 27.8943 6.07977 28.1103 9.84777H23.5023C23.3583 7.92777 22.8543 7.63977 21.9423 7.63977C20.8863 7.63977 20.3583 8.02377 20.3583 10.9998C20.3583 13.9758 20.8863 14.3598 21.9423 14.3598C22.9023 14.3598 23.4063 14.0478 23.5023 11.8158H28.1343C28.0143 15.8238 25.7583 17.2398 21.4623 17.2398C16.9263 17.2398 14.6943 15.5598 14.6943 10.9998Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefFive}
          />
          <path
            d="M0.951904 15.6558L2.3199 12.6078C4.1439 13.5438 6.0159 14.0238 7.7199 14.0238C8.8479 14.0238 9.06391 13.8078 9.06391 13.4718C9.06391 13.2078 8.9199 13.0398 8.3439 12.9678L5.6559 12.6318C3.0639 12.2958 1.5279 10.9998 1.5279 8.76777C1.5279 6.46377 3.1359 4.75977 7.9839 4.75977C10.5519 4.75977 12.4239 5.23977 13.9119 5.98377L12.5439 9.03177C11.0319 8.26377 9.5439 7.97577 8.1999 7.97577C6.9999 7.97577 6.8079 8.21577 6.8079 8.52777C6.8079 8.81577 6.9759 8.95977 7.5279 9.03177L10.2159 9.36777C13.0479 9.72777 14.3439 11.0958 14.3439 13.2078C14.3439 15.9438 12.1839 17.2398 7.9839 17.2398C4.7199 17.2398 2.6319 16.4958 0.951904 15.6558Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            ref={textRefSix}
          />
        </svg>
      </div>
      <svg
        width="24"
        height="90"
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
