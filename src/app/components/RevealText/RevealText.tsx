'use client';
import React, { useRef } from 'react';

import { asText, RichTextField } from '@prismicio/client';

import styles from './RevealText.module.css';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

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
}) => {
  const words = asText(field).split(' ');
  const componentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.reveal-text-word', {
        y: 0,
        stagger: staggerAmount,
        duration: duration,
        ease: 'power3.out',
        delay: delay,
      });
    },
    { scope: componentRef }
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
              paddingRight: index - 1 !== words.length - 1 ? '0.15em' : '0',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
};
