import React, { JSX } from 'react';
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
  console.log(slice.primary.phase_field[0]?.end_date);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.schedule__container}
    >
      <div className={styles.schedule__title_container}>
        <div className={styles.schedule__title}>
          <PrismicRichText field={slice.primary.phase_title} />
          <div className={styles.circle}></div>
        </div>
      </div>
      <div className={styles.schedule__content}>
        <div className={styles.schedule__important}>
          <PrismicRichText field={slice.primary.important_to_know_field} />
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
