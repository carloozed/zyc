'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import styles from './index.module.css';
import GallerySectionHeader from '@/app/components/GallerySectionHeader/GallerySectionHeader';
import useGalleryIntroAnimation from '@/helpers/useGalleryIntroAnimation';
import {
  GalleryImage,
  GalleryPageContext,
  getVisibleGalleryImages,
} from '@/helpers/gallery';

/**
 * Props for `GalleryYear`.
 */
export type GalleryYearProps = SliceComponentProps<Content.GalleryYearSlice>;

const MOBILE_MEDIA_QUERY = '(max-width: 48rem)';
const TABLET_MEDIA_QUERY = '(max-width: 74rem)';
const TABLET_COLUMN_COUNT = 3;
const DESKTOP_COLUMN_COUNT = 4;

function getGalleryColumnCount() {
  if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) return 1;
  if (window.matchMedia(TABLET_MEDIA_QUERY).matches) return TABLET_COLUMN_COUNT;
  return DESKTOP_COLUMN_COUNT;
}

function useGalleryColumnCount() {
  // Desktop-first initial value: SSR and first paint render the full grid;
  // the effect corrects it on smaller viewports after mount.
  const [columnCount, setColumnCount] = useState(DESKTOP_COLUMN_COUNT);

  useEffect(() => {
    const queries = [MOBILE_MEDIA_QUERY, TABLET_MEDIA_QUERY].map((query) =>
      window.matchMedia(query),
    );
    const updateColumnCount = () => setColumnCount(getGalleryColumnCount());

    updateColumnCount();
    queries.forEach((query) =>
      query.addEventListener('change', updateColumnCount),
    );
    return () =>
      queries.forEach((query) =>
        query.removeEventListener('change', updateColumnCount),
      );
  }, []);

  return columnCount;
}

// Distribute images round-robin across visual columns while remembering each
// image's position in the flat, chronological list (used for lightbox indices).
function groupImagesIntoVisualColumns(
  images: GalleryImage[],
  columnCount: number,
) {
  const columns = Array.from(
    { length: Math.max(columnCount, 1) },
    (): { image: GalleryImage; chronologicalIndex: number }[] => [],
  );

  images.forEach((image, chronologicalIndex) => {
    columns[chronologicalIndex % columns.length].push({
      image,
      chronologicalIndex,
    });
  });

  return columns;
}

const GalleryYear: FC<GalleryYearProps> = ({ slice, context }) => {
  const { decoimage, onImageClick, sliceOffsets, filter } =
    context as GalleryPageContext;
  const hasAnimated = useGalleryIntroAnimation();
  const sliceOffset = sliceOffsets.get(slice.id) ?? 0;
  const gridRef = useRef<HTMLDivElement>(null);
  const columnCount = useGalleryColumnCount();

  const galleryImages = useMemo(
    () => getVisibleGalleryImages(slice.primary.gallery, filter),
    [slice.primary.gallery, filter],
  );

  const galleryColumns = useMemo(
    () => groupImagesIntoVisualColumns(galleryImages, columnCount),
    [galleryImages, columnCount],
  );

  useGSAP(
    () => {
      gsap.to(`.${styles.galleryImage}`, {
        y: 0,
        opacity: 1,
        duration: hasAnimated ? 0 : 2.4,
        delay: hasAnimated ? 0 : 2.2,
        ease: 'power3.out',
        stagger: hasAnimated ? 0 : 0.003,
      });
    },
    { scope: gridRef, dependencies: [filter, columnCount] },
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.blogcontainer}
    >
      <div className={styles.monthGroup}>
        <GallerySectionHeader
          editionYear={slice.primary.edition_year}
          decoimage={decoimage}
          hasAnimated={hasAnimated}
        />

        <div className={styles.postsGrid} ref={gridRef}>
          {galleryColumns.map((column, columnIndex) => (
            <div className={styles.imageColumn} key={columnIndex}>
              {column.map(({ image, chronologicalIndex }) => (
                <button
                  type="button"
                  onClick={() => onImageClick(sliceOffset + chronologicalIndex)}
                  key={`${image.image.url}-${chronologicalIndex}`}
                  className={styles.galleryImage}
                  aria-label={
                    image.image.alt
                      ? `${image.image.alt} in Vollansicht öffnen`
                      : `Bild ${sliceOffset + chronologicalIndex + 1} in Vollansicht öffnen`
                  }
                >
                  <PrismicNextImage
                    field={image.image}
                    loading="lazy"
                    sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 400px"
                    imgixParams={{ q: 65, w: 400 }}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryYear;
