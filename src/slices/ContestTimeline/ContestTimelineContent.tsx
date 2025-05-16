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
  const [activeIndex, setActiveIndex] = useState(0);
  const [translatePercentage, setTranslatePercentage] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    switch (activeIndex) {
      case 0:
        setTranslatePercentage(0);
        break;
      case 1:
        setTranslatePercentage(20);
        break;
      case 2:
        setTranslatePercentage(40);
        break;
      case 3:
        setTranslatePercentage(60);
        break;
      case 4:
        setTranslatePercentage(80);
        break;
      default:
        setTranslatePercentage(0);
        break;
    }
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.ctl__container}
    >
      <PrismicRichText field={slice.primary.title} />

      <div className={styles.ctl__timeline}>
        {/* First instance - render as h4 */}
        {slice.primary.timeline_contest_group.map((item, index) => (
          <div
            key={index}
            className={styles.ctl__timeline__item}
            // When mouse enters, update active index
          >
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
              <ProgressCircle item={item} styles={styles} />
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
          // Use the pre-calculated translatePercentage
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
              <PrismicRichText field={item.phase_description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
