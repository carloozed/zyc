'use client';
import React, { useRef } from 'react';

import { asText, RichTextField } from '@prismicio/client';

import styles from './RevealText.module.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  field: RichTextField;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  staggerAmount?: number;
  as?: React.ElementType;
  duration?: number;
  align?: 'center' | 'start' | 'end';
  letterByLetter?: boolean;
  delay?: number;
  useScrollTrigger?: boolean;
  triggerStart?: string;
  triggerEnd?: string;
  markers?: boolean;
};

export const RevealText: React.FC<Props> = ({
  field,
  className,
  id,
  staggerAmount = 0.2,
  as: Component = 'div',
  align = 'start',
  duration = 1.2,
  delay = 0,
  useScrollTrigger = false,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  markers = false,
}) => {
  const words = asText(field).split(' ');
  const componentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const animation = gsap.to('.reveal-text-word', {
        y: 0,
        stagger: staggerAmount,
        duration: duration,
        ease: 'power3.out',
        delay: useScrollTrigger ? 0 : delay, // No delay for scroll trigger
      });

      if (useScrollTrigger) {
        ScrollTrigger.create({
          trigger: componentRef.current,
          start: triggerStart,
          end: triggerEnd,
          animation: animation,
          markers: markers,
        });
      }
    },
    { scope: componentRef, dependencies: [useScrollTrigger] }
  );

  return (
    <Component ref={componentRef}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}-${id}`}
          className={`reveal-text-container ${styles.outerspan} ${align === 'center' ? styles.center : align === 'start' ? styles.start : styles.end} ${className || ''}`}
        >
          <span
            className={`reveal-text-word ${styles.innerspan}`}
            style={{
              paddingRight: index !== words.length - 1 ? '0.15em' : '0', // Fixed the condition
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
};
