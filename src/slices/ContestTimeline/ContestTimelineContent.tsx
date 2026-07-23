'use client';

import React, { useEffect, useState } from 'react';
import styles from './ContestTimelineContent.module.css';
import {
  ContestTimelineSlice,
  WeAreHereImageDocument,
} from '@/prismicio-types';
import { asText } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { JSXMapSerializer } from '@prismicio/react';
import ProgressCircle from './ProgressCircle';
import { PrismicNextImage } from '@prismicio/next';

import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  slice: ContestTimelineSlice;
  wearehereicon: WeAreHereImageDocument;
};

// The circle labels are repeated as h3 in the descriptions below, so they
// render as styled paragraphs to keep the heading outline in order.
const labelComponents: JSXMapSerializer = {
  heading1: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
  heading2: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
  heading3: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
  heading4: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
  heading5: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
  heading6: ({ children }) => <p className={styles.phaselabel}>{children}</p>,
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
  const [activeIndex, setActiveIndex] = useState(0);

  const currentDate = new Date();

  const currentPhaseIndex = slice.primary.timeline_contest_group.findIndex(
    (item) => {
      if (!item.start_date || !item.end_date) return false;
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      return currentDate >= startDate && currentDate <= endDate;
    },
  );

  useEffect(() => {
    if (currentPhaseIndex !== -1) {
      setActiveIndex(currentPhaseIndex);
    }
  }, [currentPhaseIndex]);

  const groupLength = slice.primary.timeline_contest_group.length;
  const translatePercentage =
    groupLength > 0 ? (activeIndex * 100) / groupLength : 0;

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

            <button
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-label={asText(item.phase_name)}
              className={styles.ctl__timeline__item__circle}
            >
              <ProgressCircle item={item} styles={styles} delay={index * 0.2} />
            </button>
            <div className={styles.ctl__timeline__item__title}>
              <PrismicRichText
                field={item.phase_name}
                components={labelComponents}
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
              className={styles.ctl__timeline__item__description}
            >
              <PrismicRichText
                field={item.phase_name}
                components={h3Components}
              />
              <div className={styles.text}>
                <PrismicRichText field={item.phase_date_text} />
                <PrismicRichText field={item.phase_description} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
