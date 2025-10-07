'use client';

import React, { useEffect, useState } from 'react';
import styles from './ContestTimelineContent.module.css';
import {
  ContestTimelineSlice,
  WeAreHereImageDocument,
} from '../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { JSXMapSerializer } from '@prismicio/react';
import ProgressCircle from './ProgressCircle';
import { PrismicNextImage } from '@prismicio/next';

import { RevealText } from '@/app/components/RevealText/RevealText';
import Timer from './Timer/Timer';

type Props = {
  slice: ContestTimelineSlice;
  wearehereicon: WeAreHereImageDocument;
};

// Components for h4
const h4Components: JSXMapSerializer = {
  heading1: ({ children }) => <h4>{children}</h4>,
  heading2: ({ children }) => <h4>{children}</h4>,
  heading3: ({ children }) => <h4>{children}</h4>,
  heading4: ({ children }) => <h4>{children}</h4>,
  heading5: ({ children }) => <h4>{children}</h4>,
  heading6: ({ children }) => <h4>{children}</h4>,
};

// Components for h3
const h3Components: JSXMapSerializer = {
  heading1: ({ children }) => <h3>{children}</h3>,
  heading2: ({ children }) => <h3>{children}</h3>,
  heading3: ({ children }) => <h3>{children}</h3>,
  heading4: ({ children }) => <h3>{children}</h3>,
  heading5: ({ children }) => <h3>{children}</h3>,
  heading6: ({ children }) => <h3>{children}</h3>,
};

export default function ContestTimelineContent({
  slice,
  wearehereicon,
}: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeIndex, setActiveIndex] = useState(currentPhase);
  const [translatePercentage, setTranslatePercentage] = useState(0);

  const currentDate = new Date();

  const currentPhaseIndex = slice.primary.timeline_contest_group.findIndex(
    (item) => {
      if (!item.start_date || !item.end_date) return false;
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      return currentDate >= startDate && currentDate <= endDate;
    }
  );

  useEffect(() => {
    if (currentPhaseIndex !== -1) {
      setCurrentPhase(currentPhaseIndex);
      setActiveIndex(currentPhaseIndex);
    }
  }, [currentPhaseIndex]);

  useEffect(() => {
    switch (activeIndex) {
      case 0:
        setTranslatePercentage(0);
        break;
      case 1:
        setTranslatePercentage((1 / 6) * 100); // 16.67%
        break;
      case 2:
        setTranslatePercentage((1 / 3) * 100); // 33.33%
        break;
      case 3:
        setTranslatePercentage((3 / 6) * 100); // 66.67%
        break;
      case 4:
        setTranslatePercentage((4 / 6) * 100); // 83.33%
        break;
      case 5:
        setTranslatePercentage((5 / 6) * 100); // 83.33%
        break;
      default:
        setTranslatePercentage(currentPhase);
        break;
    }
  }, [activeIndex, currentPhase]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.ctl__container}
    >
      <RevealText
        field={slice.primary.title}
        useScrollTrigger={true}
        as={'h2'}
      />

      <div className={styles.ctl__timeline}>
        {slice.primary.timeline_contest_group.map((item, index) => (
          <div key={index} className={styles.ctl__timeline__item}>
            {item.start_date &&
              item.end_date &&
              new Date(item.start_date) <= new Date() &&
              new Date(item.end_date) >= new Date() && (
                <div className={styles.ctl__timeline__item__indicator}>
                  <PrismicNextImage field={wearehereicon.data.image} />
                </div>
              )}

            <div
              onMouseEnter={() => setActiveIndex(index)}
              className={`${styles.ctl__timeline__item__circle} ${activeIndex === index ? styles.active : ''}`}
            >
              <ProgressCircle item={item} styles={styles} delay={index * 0.2} />
            </div>
            <div className={styles.ctl__timeline__item__title}>
              <PrismicRichText
                field={item.phase_name}
                components={h4Components}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctl__timeline__wrapper}>
        <div
          className={styles.ctl__timeline__item__descriptioncontainer}
          style={{
            transform: `translateX(-${translatePercentage}%)`,
          }}
        >
          {slice.primary.timeline_contest_group.map((item, index) => (
            <div
              key={`h3-${index}`}
              className={`${styles.ctl__timeline__item__description} ${activeIndex === index ? styles.active_description : ''}`}
            >
              <PrismicRichText
                field={item.phase_name}
                components={h3Components}
              />
              {item.individual_key === 'anmeldephase' &&
              item.start_date &&
              new Date() < new Date('2025-10-10') ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <h3>10.10.2025 - 31.10.2025</h3>
                  <p>Das Anmeldefenster öffnet in</p>
                  <Timer startDate={'2025-10-10T00:00:00'} />
                  <p>Tagen</p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  className={styles.text}
                >
                  <PrismicRichText field={item.phase_date_text} />
                  <PrismicRichText field={item.phase_description} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
