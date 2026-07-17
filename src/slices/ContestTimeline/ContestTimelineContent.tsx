'use client';

import React, { useEffect, useState } from 'react';
import styles from './ContestTimelineContent.module.css';
import {
  ContestTimelineSlice,
  WeAreHereImageDocument,
} from '@/prismicio-types';
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

// Renders every heading level of a rich-text field as the same fixed tag.
const headingsAs = (Tag: 'h3' | 'h4'): JSXMapSerializer => ({
  heading1: ({ children }) => <Tag>{children}</Tag>,
  heading2: ({ children }) => <Tag>{children}</Tag>,
  heading3: ({ children }) => <Tag>{children}</Tag>,
  heading4: ({ children }) => <Tag>{children}</Tag>,
  heading5: ({ children }) => <Tag>{children}</Tag>,
  heading6: ({ children }) => <Tag>{children}</Tag>,
});

const h4Components = headingsAs('h4');
const h3Components = headingsAs('h3');

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
};

function isNowWithin(start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
}

export default function ContestTimelineContent({
  slice,
  wearehereicon,
}: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeIndex, setActiveIndex] = useState(currentPhase);
  const [translatePercentage, setTranslatePercentage] = useState(0);

  const currentPhaseIndex = slice.primary.timeline_contest_group.findIndex(
    (item) => isNowWithin(item.start_date, item.end_date),
  );

  useEffect(() => {
    if (currentPhaseIndex !== -1) {
      setCurrentPhase(currentPhaseIndex);
      setActiveIndex(currentPhaseIndex);
    }
  }, [currentPhaseIndex]);

  useEffect(() => {
    const percentages = [0, 20, 40, 60, 80];
    setTranslatePercentage(percentages[activeIndex] ?? currentPhase);
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
            {isNowWithin(item.start_date, item.end_date) && (
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
                <div style={columnStyle}>
                  <h3>10.10.2025 - 31.10.2025</h3>
                  <p>Das Anmeldefenster öffnet in</p>
                  <Timer startDate={'2025-10-10T00:00:00'} />
                  <p>Tagen</p>
                </div>
              ) : (
                <div style={columnStyle} className={styles.text}>
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
