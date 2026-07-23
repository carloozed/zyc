'use client';

import React, { useState } from 'react';

import styles from './ArtistsProgrammeContent.module.css';
import { PrismicRichText } from '@prismicio/react';
import { Content, KeyTextField } from '@prismicio/client';
import CategoryWrapper from '../CategoryWrapper/CategoryWrapper';
import DescriptionComponent from '../DescriptionComponent/DescriptionComponent';
import GraphicalArrow from '@/app/components/GraphicalArrow/GraphicalArrow';
import GraphicalArrowCurved from '@/app/components/GraphicalArrowCurved/GraphicalArrowCurved';

type ArtistsProgrammeContentProps = {
  slice: Content.ArtistsProgrammeSlice;
};

export default function ArtistProgrammeContent({
  slice,
}: ArtistsProgrammeContentProps) {
  const [activeElement, setActiveElement] = useState<string | KeyTextField>(
    'contest',
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.wrapper}
    >
      <div className={styles.title}>
        <PrismicRichText field={slice.primary.title} />
      </div>
      <div className={styles.content}>
        <section className={styles.categories}>
          <CategoryWrapper
            category={slice.primary.categories[0]}
            as={'li'}
            onMouseOver={() => setActiveElement('contest')}
          />
          <GraphicalArrow />
          <CategoryWrapper
            category={slice.primary.categories[1]}
            as={'li'}
            onMouseOver={() => setActiveElement('ubergang')}
          />
          <div className={styles.curvedArrow}>
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
