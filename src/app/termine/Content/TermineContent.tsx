'use client';

import React, { useRef } from 'react';

import styles from './TermineContent.module.css';

import { TeilnahmeTermineDocument } from '../../../../prismicio-types';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import gsap from 'gsap';

import { useGSAP } from '@gsap/react';
import { RevealText } from '@/app/components/RevealText/RevealText';

gsap.registerPlugin(useGSAP);

type Props = { page: TeilnahmeTermineDocument };

export default function TermineContent({ page }: Props) {
  const lowerContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial position off-screen
      gsap.set(lowerContainerRef.current, { y: 100 }); // or whatever offset you want

      // Animate to natural position
      gsap.to(lowerContainerRef.current, {
        y: '-2.5%', // Move to natural position
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
      </div>
      <div className={styles.termine__content} ref={lowerContainerRef}>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </section>
  );
}
