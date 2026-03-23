'use client';

import React, { useMemo, useState, useCallback } from 'react';

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
import GalleryLightbox from './components/GalleryLightbox';

type MagazineContentProps = {
  page: GalleryDocument;
  decoimage: DecorationImageDocument;
};

export default function GalleryContent({
  page,
  decoimage,
}: MagazineContentProps) {
  const { filter } = useGalleryFilterStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  // Flatten all images from all slices into a flat slides array for the lightbox
  const allSlides = useMemo(() => {
    return filteredPosts.flatMap((slice) =>
      slice.primary.gallery.map((image) => ({
        src: image.image.url ?? '',
        alt: image.image.alt ?? 'alttext',
      })),
    );
  }, [filteredPosts]);

  // Build a map of slice index -> global offset so each GalleryYear knows its starting index
  const sliceOffsets = useMemo(() => {
    const offsets = new Map<string, number>();
    let offset = 0;
    for (const slice of filteredPosts) {
      offsets.set(slice.id, offset);
      offset += slice.primary.gallery.length;
    }
    return offsets;
  }, [filteredPosts]);

  const onImageClick = useCallback((globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  }, []);

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
          ></FadeIn>
        </div>
      </div>
      <div className={styles.lowercontainer}>
        <div className={styles.filter}>
          <FilterContainer page={page} filters={filters} isGallery={true} />
        </div>
        <div className={styles.gallerycontainer}>
          <SliceZone
            slices={filteredPosts}
            components={components}
            context={{ decoimage, onImageClick, sliceOffsets }}
          />
        </div>
      </div>
      <GalleryLightbox
        slides={allSlides}
        lightboxOpen={lightboxOpen}
        setLightboxOpen={setLightboxOpen}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
