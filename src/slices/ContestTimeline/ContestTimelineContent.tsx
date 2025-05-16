'use client';

import React from 'react';
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
          <div key={index} className={styles.ctl__timeline__item}>
            {item.start_date &&
              item.end_date &&
              new Date(item.start_date) <= new Date() &&
              new Date(item.end_date) >= new Date() && (
                <div className={styles.ctl__timeline__item__indicator}>
                  <PrismicNextImage field={wearehereicon.data.image} />
                </div>
              )}

            <div className={styles.ctl__timeline__item__circle}>
              <ProgressCircle item={item} styles={styles} />
            </div>
            <div
              key={`h4-${index}`}
              className={styles.ctl__timeline__item__title}
            >
              <PrismicRichText
                field={item.phase_name}
                components={h4Components}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        {slice.primary.timeline_contest_group.map((item, index) => (
          <div key={`h3-${index}`}>
            <PrismicRichText
              field={item.phase_name}
              components={h3Components}
            />
            <PrismicRichText field={item.phase_description} />
          </div>
        ))}
      </div>
    </section>
  );
}
