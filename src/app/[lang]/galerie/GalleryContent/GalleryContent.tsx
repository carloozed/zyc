'use client';

import { useMemo, useState, useCallback } from 'react';

import styles from './GalleryContent.module.css';
import {
  DecorationImageDocument,
  GalleryDocument,
  GalleryYearSlice,
  VideosYearSlice,
} from '@/prismicio-types';
import { RevealText } from '@/app/components/RevealText/RevealText';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import useGalleryStore from '@/stores/GalleryStore';
import {
  GalleryPageContext,
  GallerySlide,
  getVisibleGalleryImages,
  getVisibleYearSlices,
} from '@/helpers/gallery';

import GalleryLightbox from './components/GalleryLightbox';
import CopyrightNotice from './components/CopyrightNotice';
import GalleryFilterContainer from './components/GalleryFilterContainer';

const SLICES_PER_PAGE = 1;

type GalleryContentProps = {
  page: GalleryDocument;
  decoimage: DecorationImageDocument;
};

export default function GalleryContent({
  page,
  decoimage,
}: GalleryContentProps) {
  const filter = useGalleryStore((state) => state.filter);
  const galleryYear = useGalleryStore((state) => state.galleryYear);
  const mediaType = useGalleryStore((state) => state.mediaType);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(SLICES_PER_PAGE);

  // Spread first: the SliceZone tuple-union type breaks .filter's predicate
  // narrowing when filtering it directly
  const photoSlices = useMemo(
    () =>
      [...page.data.slices].filter(
        (slice): slice is GalleryYearSlice =>
          slice.slice_type === 'gallery_year',
      ),
    [page.data.slices],
  );

  const videoSlices = useMemo(
    () =>
      [...page.data.slices].filter(
        (slice): slice is VideosYearSlice => slice.slice_type === 'videos_year',
      ),
    [page.data.slices],
  );

  // With an event filter active, keep only slices that still have images
  const filteredPhotoSlices = useMemo(
    () =>
      getVisibleYearSlices(photoSlices, galleryYear).filter(
        (slice) =>
          !filter ||
          getVisibleGalleryImages(slice.primary.gallery, filter).length > 0,
      ),
    [filter, galleryYear, photoSlices],
  );

  const filteredVideoSlices = useMemo(
    () => getVisibleYearSlices(videoSlices, galleryYear),
    [galleryYear, videoSlices],
  );

  const visiblePhotoSlices = useMemo(
    () => filteredPhotoSlices.slice(0, visibleCount),
    [filteredPhotoSlices, visibleCount],
  );
  const hasMore = visibleCount < filteredPhotoSlices.length;

  // The lightbox shows one flat slides array across all visible slices; each
  // slice gets its starting offset into it so an image click can be mapped to
  // the matching global slide index.
  const { slides, sliceOffsets } = useMemo(() => {
    const offsets = new Map<string, number>();
    const flatSlides: GallerySlide[] = [];

    for (const slice of visiblePhotoSlices) {
      offsets.set(slice.id, flatSlides.length);
      for (const image of getVisibleGalleryImages(
        slice.primary.gallery,
        filter,
      )) {
        flatSlides.push({
          src: image.image.url ?? '',
          alt: image.image.alt ?? 'alttext',
        });
      }
    }

    return { slides: flatSlides, sliceOffsets: offsets };
  }, [visiblePhotoSlices, filter]);

  const onImageClick = useCallback((globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  }, []);

  const sliceZoneContext: GalleryPageContext = {
    decoimage,
    filter,
    sliceOffsets,
    onImageClick,
  };

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
          <GalleryFilterContainer page={page} />
        </div>
        <div className={styles.gallerycontainer}>
          {mediaType === 'photos' ? (
            <>
              <SliceZone
                slices={visiblePhotoSlices}
                components={components}
                context={sliceZoneContext}
              />
              {hasMore && (
                <button
                  className={styles.loadMore}
                  onClick={() =>
                    setVisibleCount((prev) => prev + SLICES_PER_PAGE)
                  }
                >
                  Mehr laden
                </button>
              )}
            </>
          ) : (
            <SliceZone
              slices={filteredVideoSlices}
              components={components}
              context={sliceZoneContext}
            />
          )}
        </div>
      </div>
      {mediaType === 'photos' && (
        <GalleryLightbox
          slides={slides}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          index={lightboxIndex}
        />
      )}
      <CopyrightNotice />
    </div>
  );
}
