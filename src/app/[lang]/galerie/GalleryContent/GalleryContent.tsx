'use client';

import React, { useMemo, useState, useCallback } from 'react';

import styles from './GalleryContent.module.css';
import {
  DecorationImageDocument,
  GalleryDocument,
} from '../../../../../prismicio-types';
import FilterContainer from '../../magazin/components/FilterContainer/FilterContainer';
import { RevealText } from '@/app/components/RevealText/RevealText';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import useFilterStore from '@/stores/FilterStore';
import useSortingStore from '@/stores/SortingStore';
import GalleryLightbox from './components/GalleryLightbox';

type MagazineContentProps = {
  page: GalleryDocument;
  decoimage: DecorationImageDocument;
};

export default function GalleryContent({
  page,
  decoimage,
}: MagazineContentProps) {
  const { filter } = useFilterStore();
  const { sorting } = useSortingStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filters = [
    ...new Set(
      page.data.slices.flatMap((post) =>
        post.primary.gallery.flatMap((item) => item.eventtag),
      ),
    ),
  ];

  const SLICES_PER_PAGE = 3;
  const [visibleCount, setVisibleCount] = useState(SLICES_PER_PAGE);

  const filteredPosts = useMemo(() => {
    let result = [...page.data.slices].sort(
      (a, b) =>
        (b.primary.year_in_number ?? 0) - (a.primary.year_in_number ?? 0),
    );

    // Filter by event type — keep slices that have at least one matching image
    if (filter) {
      result = result.filter((post) =>
        post.primary.gallery.some(
          (item) => item.eventtag?.toLowerCase() === filter,
        ),
      );
    }

    // Filter by year (edition dropdown)
    if (sorting && sorting !== 'neu' && sorting !== 'alt') {
      const yearNum = Number(sorting);
      if (!isNaN(yearNum)) {
        result = result.filter(
          (post) => post.primary.year_in_number === yearNum,
        );
      }
    }

    return result;
  }, [filter, sorting, page.data.slices]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Flatten all images from visible slices into a flat slides array for the lightbox
  const allSlides = useMemo(() => {
    return visiblePosts.flatMap((slice) =>
      slice.primary.gallery
        .filter((image) => !filter || image.eventtag?.toLowerCase() === filter)
        .map((image) => ({
          src: image.image.url ?? '',
          alt: image.image.alt ?? 'alttext',
        })),
    );
  }, [visiblePosts, filter]);

  // Build a map of slice index -> global offset so each GalleryYear knows its starting index
  const sliceOffsets = useMemo(() => {
    const offsets = new Map<string, number>();
    let offset = 0;
    for (const slice of visiblePosts) {
      const imageCount = filter
        ? slice.primary.gallery.filter((i) => i.eventtag?.toLowerCase() === filter).length
        : slice.primary.gallery.length;
      offsets.set(slice.id, offset);
      offset += imageCount;
    }
    return offsets;
  }, [visiblePosts, filter]);

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
        </div>
      </div>
      <div className={styles.lowercontainer}>
        <div className={styles.filter}>
          <FilterContainer page={page} filters={filters} isGallery={true} />
        </div>
        <div className={styles.gallerycontainer}>
          <SliceZone
            slices={visiblePosts}
            components={components}
            context={{ decoimage, onImageClick, sliceOffsets, filter }}
          />
          {hasMore && (
            <button
              className={styles.loadMore}
              onClick={() => setVisibleCount((prev) => prev + SLICES_PER_PAGE)}
            >
              Mehr laden
            </button>
          )}
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
