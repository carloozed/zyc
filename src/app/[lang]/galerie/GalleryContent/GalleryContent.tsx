'use client';

import React, { useMemo } from 'react';

import styles from './GalleryContent.module.css';
import {
  DecorationImageDocument,
  GalleryDocument,
} from '../../../../../prismicio-types';
import FilterContainer from '../../magazin/components/FilterContainer/FilterContainer';
import { RevealText } from '@/app/components/RevealText/RevealText';
import FadeIn from '@/app/components/FadeIn/FadeIn';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import useGalleryFilterStore from '@/stores/GalleryFilterStore';

type MagazineContentProps = {
  page: GalleryDocument;
  decoimage: DecorationImageDocument;
};

export default function GalleryContent({
  page,
  decoimage,
}: MagazineContentProps) {
  const { filter } = useGalleryFilterStore();

  const filters = [
    ...new Set(page.data.slices.flatMap((post) => post.primary.event_type)),
  ];

  const filteredPosts = useMemo(() => {
    const sorted = [...page.data.slices].sort(
      (a, b) =>
        (b.primary.year_in_number ?? 0) - (a.primary.year_in_number ?? 0),
    );
    if (!filter) return sorted;
    return sorted.filter((post) => post.primary.event_type === filter);
  }, [filter, page.data.slices]);

  return (
    <div className={styles.container}>
      <div className={styles.uppercontainer}>
        <div className={styles.titleContainer}>
          <RevealText
            field={page.data.title}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.0}
            as={'h1'}
          />

          <FadeIn
            vars={{
              delay: 2,
              duration: 1.3,
              y: 0,
            }}
            className={styles.number}
          >
            <h5>({filteredPosts.length})</h5>
          </FadeIn>
        </div>
      </div>
      <div className={styles.lowercontainer}>
        <div className={styles.filter}>
          <FilterContainer page={page} filters={filters} isGallery={true} />
        </div>
        <div className={styles.gallerycontainer}>
          <SliceZone
            slices={page.data.slices}
            components={components}
            context={{ decoimage }}
          />
        </div>
      </div>
    </div>
  );
}
