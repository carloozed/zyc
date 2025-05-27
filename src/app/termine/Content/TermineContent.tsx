'use client';

import React, { useRef } from 'react';

import styles from './TermineContent.module.css';

import { TeilnahmeTermineDocument } from '../../../../prismicio-types';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import gsap from 'gsap';

import { useGSAP } from '@gsap/react';
import { RevealText } from '@/app/components/RevealText/RevealText';
import Square from './components/Square';
import ArrowUp from './components/ArrowUp';
import Arrow from '@/slices/ScheduleSlice/components/Arrow';
import ArrowDown from './components/ArrowDown';

gsap.registerPlugin(useGSAP);

type Props = { page: TeilnahmeTermineDocument };

export default function TermineContent({ page }: Props) {
  const lowerContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(lowerContainerRef.current, { y: 100 });

      gsap.to(lowerContainerRef.current, {
        y: '-2.5%',
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.8,
      });
    },
    { scope: lowerContainerRef }
  );
  return (
    <section className={styles.container}>
      <div className={styles.termine__hero}>
        <RevealText field={page.data.page_title} as={'h1'} delay={0.7} />
        <div className={styles.terime_illustrationcontainer}>
          <div className={styles.svgcontainer}>
            <Square delay={0} duration={2.4} />

            <div className={styles.arrowup}>
              <ArrowUp delay={0.15} duration={2.4} />
            </div>

            <Square delay={0.3} duration={2.4} />

            <ArrowDown delay={0.45} duration={2.4} />

            <Square delay={0.6} duration={2.4} />

            <div className={styles.arrowup}>
              <ArrowUp delay={0.75} duration={2.4} />
            </div>

            <Square delay={0.9} duration={2.4} />
          </div>
        </div>
      </div>
      <div className={styles.termine__content} ref={lowerContainerRef}>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </section>
  );
}
