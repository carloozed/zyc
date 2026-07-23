'use client';

import React, { useRef, useState } from 'react';

import styles from './ArtistsProgrammeContent.module.css';
import { Content, KeyTextField } from '@prismicio/client';
import CategoryWrapper from '../CategoryWrapper/CategoryWrapper';
import DescriptionComponent from '../DescriptionComponent/DescriptionComponent';
import GraphicalArrow from '@/app/components/GraphicalArrow/GraphicalArrow';
import GraphicalArrowCurved from '@/app/components/GraphicalArrowCurved/GraphicalArrowCurved';
import { RevealText } from '@/app/components/RevealText/RevealText';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, CustomEase);

// The exact curve behind the site's page fade-in: cubic-bezier(0.22, 1, 0.36, 1)
const siteEase = CustomEase.create('siteBezier', '0.22, 1, 0.36, 1');

type ArtistsProgrammeContentProps = {
  slice: Content.ArtistsProgrammeSlice;
};

export default function ArtistProgrammeContent({
  slice,
}: ArtistsProgrammeContentProps) {
  const [activeElement, setActiveElement] = useState<string | KeyTextField>(
    'contest',
  );

  const sectionRef = useRef<HTMLElement>(null);
  const straightArrowRef = useRef<HTMLDivElement>(null);
  const curvedArrowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: siteEase },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });

      // Categories rise out of their overflow-hidden clips; the arrows draw
      // in between and may still be drawing while the next category comes
      // in — that overlap is intentional. The title animates via RevealText.
      tl.from('.category-slide', { yPercent: 110, duration: 1.6, stagger: 0.35 }, 0);

      if (straightArrowRef.current) {
        tl.from(
          straightArrowRef.current.querySelector('.draw'),
          { drawSVG: '0%', duration: 1.4 },
          0.8,
        ).from(
          straightArrowRef.current.querySelector('.head'),
          { scale: 0, transformOrigin: 'left center', duration: 0.4 },
          '>-0.2',
        );
      }

      if (curvedArrowRef.current) {
        tl.from(
          curvedArrowRef.current.querySelector('.draw'),
          { drawSVG: '0%', duration: 1.8 },
          1.5,
        ).from(
          curvedArrowRef.current.querySelector('.head'),
          { scale: 0, transformOrigin: 'left center', duration: 0.4 },
          '>-0.2',
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.wrapper}
    >
      <div className={styles.title}>
        <RevealText
          field={slice.primary.title}
          useScrollTrigger={true}
          as={'h2'}
          staggerAmount={0.15}
          duration={1.4}
          triggerStart={'top 60%'}
        />
      </div>
      <div className={styles.content}>
        <section className={styles.categories}>
          <CategoryWrapper
            category={slice.primary.categories[0]}
            as={'li'}
            onMouseOver={() => setActiveElement('contest')}
          />
          <div ref={straightArrowRef} style={{ display: 'contents' }}>
            <GraphicalArrow />
          </div>
          <CategoryWrapper
            category={slice.primary.categories[1]}
            as={'li'}
            onMouseOver={() => setActiveElement('ubergang')}
          />
          <div ref={curvedArrowRef} className={styles.curvedArrow}>
            <GraphicalArrowCurved />
          </div>
          <div className={styles.cadenzacrescendo}>
            <div className={styles.cadenza}>
              <CategoryWrapper
                category={slice.primary.categories[2]}
                as={'li'}
                onMouseOver={() => setActiveElement('cadenza')}
              />
            </div>
            <div className={styles.crescendo}>
              <CategoryWrapper
                category={slice.primary.categories[3]}
                as={'li'}
                onMouseOver={() => setActiveElement('crescendo')}
              />
            </div>
          </div>
        </section>

        <DescriptionComponent slice={slice} activeElement={activeElement} />
      </div>
    </section>
  );
}
