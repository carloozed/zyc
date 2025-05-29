import React from 'react';
import {
  AnmeldelinkDocument,
  CriteriasSlice,
  CriteriatypesubfieldDocument,
} from '../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

import { RevealText } from '@/app/components/RevealText/RevealText';

import styles from './CriteriasContent.module.css';

type Props = {
  slice: CriteriasSlice;
  disciplinetypes: CriteriatypesubfieldDocument[];
  signuplink: AnmeldelinkDocument;
};

export default function CriteriasContent({
  slice,
  disciplinetypes,
  signuplink,
}: Props) {
  return (
    <>
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={styles.criterias__section}
      >
        <RevealText
          field={slice.primary.title}
          useScrollTrigger={true}
          as={'h2'}
        />
        <div className={styles.criterias__container}>
          {disciplinetypes
            .find(
              (disciplinetype) =>
                disciplinetype.data.belongs_to_slice ===
                slice.primary.slice_name
            )
            ?.data.fieldcontent.map((disciplinetype, index) => (
              <div key={index} className={styles.criteria__item}>
                <div className={styles.criteria__titlecontainer}>
                  <div className={styles.criteria__title}>
                    <RevealText
                      field={disciplinetype.title}
                      useScrollTrigger={true}
                      as={'h3'}
                    />
                  </div>
                </div>
                <div className={styles.criteria__overviewcontent}>
                  <PrismicRichText field={disciplinetype.short_overview} />
                  <PrismicRichText field={disciplinetype.conditions} />
                </div>
              </div>
            ))}
        </div>
        <div className={styles.criterias__buttoncontainer}>
          <PrismicRichText field={slice.primary.cta_contest} />
          <PrismicNextLink field={signuplink.data.anmeldelink} />
        </div>
      </section>
    </>
  );
}
