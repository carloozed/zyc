'use client';

import React, { JSX, useRef, useEffect } from 'react';
import { ScheduleSliceSlice } from '../../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import styles from './ScheduleContent.module.css';

import Arrow from './Arrow';
import { isFilled } from '@prismicio/client';

type Props = { slice: ScheduleSliceSlice };

// Helper function that returns JSX
const formatToGermanDate = (dateString: string): JSX.Element => {
  const date = new Date(dateString);

  const monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  return (
    <div className={styles.schedule__date}>
      <h3>{day}</h3>{' '}
      <h4 style={{ paddingTop: 'var(--padding-xs)' }}>{month}</h4>
    </div>
  );
};

export default function ScheduleContent({ slice }: Props) {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const updateLinePosition = () => {
      if (
        titleRef.current &&
        contentRef.current &&
        containerRef.current &&
        lineRef.current
      ) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const titleRect = titleRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        // Calculate positions relative to the container
        const x1 = titleRect.left + titleRect.width / 2 - containerRect.left;
        const y1 = titleRect.top + titleRect.height / 2 - containerRect.top;
        const x2 =
          contentRect.left + contentRect.width / 2 - containerRect.left;
        const y2 = contentRect.top + contentRect.height / 2 - containerRect.top;

        lineRef.current.setAttribute('x1', x1.toString());
        lineRef.current.setAttribute('y1', y1.toString());
        lineRef.current.setAttribute('x2', x2.toString());
        lineRef.current.setAttribute('y2', y2.toString());
      }
    };

    updateLinePosition();
    window.addEventListener('resize', updateLinePosition);
    const timeout = setTimeout(updateLinePosition, 100);

    return () => {
      window.removeEventListener('resize', updateLinePosition);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.schedule__container}
    >
      <svg className={styles.connecting_line}>
        <line
          ref={lineRef}
          x1="0"
          y1="0"
          x2="0"
          y2="0"
          stroke="black"
          strokeWidth="0.5"
        />
      </svg>

      <div className={styles.schedule__title_container}>
        <div className={styles.schedule__title}>
          <PrismicRichText field={slice.primary.phase_title} />
          <div className={styles.circle}>
            <div ref={titleRef}></div>
          </div>
        </div>
      </div>

      <div className={styles.schedule__content}>
        <div className={styles.schedule__important}>
          <PrismicRichText field={slice.primary.important_to_know_field} />
          <div className={styles.circleSecond}>
            <div ref={contentRef}></div>
          </div>
        </div>
        <div>
          {slice.primary.phase_field.map((item, index) => (
            <div key={index} className={styles.schedule__phasecontainer}>
              <div className={styles.schedule__datecontainer}>
                {isFilled.date(item.end_date) && (
                  <>
                    <div className={styles.square}></div>
                    <div className={styles.square}></div>
                    <div className={styles.arrow}>
                      <Arrow />
                    </div>
                    {item.end_date && formatToGermanDate(item.end_date)}
                  </>
                )}
              </div>
              <div className={styles.schedule__phase}>
                <div>
                  <PrismicRichText field={item.phase_title} />
                </div>
                <div className={styles.schedule__phase__description}>
                  <div className={styles.square}></div>
                  <div className={styles.square}></div>
                  <PrismicRichText field={item.description} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
