'use client';

import React, { useRef } from 'react';

import styles from './PosterSliceContent.module.css';
import { PrismicNextImage } from '@prismicio/next';
import { PosterSliceSlice } from '@/prismicio-types';
import PosterDownloadLink from './PosterDownloadLink';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { slice: PosterSliceSlice };

export default function PosterSliceContent({ slice }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Same scroll-triggered fade-up as the text elements, a touch slower.
      gsap.from(contentRef.current, {
        autoAlpha: 0,
        y: 24,
        duration: 1.5,
        ease: siteEase,
        scrollTrigger: { trigger: contentRef.current, start: 'top 80%' },
      });
    },
    { scope: contentRef },
  );

  return (
    <div className={styles.content} ref={contentRef}>
      <div className={styles.imagecontainer}>
        <PrismicNextImage
          field={slice.primary.poster}
          sizes="(max-width: 48rem) 92vw, (max-width: 74rem) and (orientation: portrait) 92vw, 45vw"
        />{' '}
        <div className={styles.downloadcontainer}>
          <PosterDownloadLink field={slice.primary.download_link} />
        </div>
      </div>
    </div>
  );
}
