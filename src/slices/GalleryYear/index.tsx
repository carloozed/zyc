'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import styles from './index.module.css';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { PrismicNextImage } from '@prismicio/next';
import useGalleryAnimationStore from '@/stores/GalleryAnimationStore';

/**
 * Props for `GalleryYear`.
 */
export type GalleryYearProps = SliceComponentProps<Content.GalleryYearSlice>;

type GallerySliceContext = {
  decoimage: Content.DecorationImageDocument;
  onImageClick: (globalIndex: number) => void;
  sliceOffsets: Map<string, number>;
  filter: string;
};

type GalleryImage = Content.GalleryYearSliceDefaultPrimaryGalleryItem;
type GalleryImageWithIndex = {
  image: GalleryImage;
  chronologicalIndex: number;
};

const DESKTOP_COLUMN_COUNT = 4;
const TABLET_COLUMN_COUNT = 3;

function sortGalleryImagesByDate(images: GalleryImage[], filter: string) {
  return [...images]
    .sort((a, b) => (b.date_added ?? '').localeCompare(a.date_added ?? ''))
    .filter((image) => !filter || image.eventtag?.toLowerCase() === filter);
}

function groupImagesIntoVisualColumns(
  images: GalleryImage[],
  columnCount: number,
) {
  const imagesWithIndex = images.map((image, chronologicalIndex) => ({
    image,
    chronologicalIndex,
  }));

  if (columnCount <= 1) {
    return [imagesWithIndex];
  }

  const columns: GalleryImageWithIndex[][] = Array.from(
    { length: columnCount },
    () => [],
  );

  imagesWithIndex.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });

  return columns;
}

function getGalleryColumnCount() {
  if (window.matchMedia('(max-width: 48rem)').matches) {
    return 1;
  }

  if (window.matchMedia('(max-width: 74rem)').matches) {
    return TABLET_COLUMN_COUNT;
  }

  return DESKTOP_COLUMN_COUNT;
}

const GalleryYear: FC<GalleryYearProps> = ({ slice, context }) => {
  const { decoimage, onImageClick, sliceOffsets, filter } =
    context as GallerySliceContext;
  const { hasAnimated, setHasAnimated } = useGalleryAnimationStore();
  const sliceOffset = sliceOffsets.get(slice.id) ?? 0;
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

  const galleryImages = useMemo(
    () => sortGalleryImagesByDate(slice.primary.gallery, filter),
    [slice.primary.gallery, filter],
  );

  const galleryColumns = useMemo(
    () => groupImagesIntoVisualColumns(galleryImages, columnCount),
    [galleryImages, columnCount],
  );

  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAnimated, setHasAnimated]);

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getGalleryColumnCount());
    const desktopQuery = window.matchMedia('(min-width: 74rem)');
    const tabletQuery = window.matchMedia(
      '(min-width: 48rem) and (max-width: 74rem)',
    );
    const mobileQuery = window.matchMedia('(max-width: 48rem)');

    updateColumnCount();
    desktopQuery.addEventListener('change', updateColumnCount);
    tabletQuery.addEventListener('change', updateColumnCount);
    mobileQuery.addEventListener('change', updateColumnCount);

    return () => {
      desktopQuery.removeEventListener('change', updateColumnCount);
      tabletQuery.removeEventListener('change', updateColumnCount);
      mobileQuery.removeEventListener('change', updateColumnCount);
    };
  }, []);

  useGSAP(
    () => {
      gsap.to(`.${styles.galleryImage}`, {
        y: 0,
        opacity: 1,
        duration: !hasAnimated ? 2.4 : 0,
        delay: !hasAnimated ? 2.2 : 0,
        ease: 'power3.out',
        stagger: !hasAnimated ? 0.003 : 0,
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
        <div className={styles.monthcontainer}>
          <FadeIn
            vars={{
              delay: !hasAnimated ? 1.2 : 0,
              duration: !hasAnimated ? 1.3 : 0,
            }}
            className={styles.title}
          >
            <PrismicRichText field={slice.primary.edition_year} />
          </FadeIn>
          <FadeIn
            className={styles.imagecontainer}
            vars={{
              delay: !hasAnimated ? 1.6 : 0,
              duration: !hasAnimated ? 1.6 : 0,
            }}
          >
            <PrismicNextImage field={decoimage.data.image} />
          </FadeIn>
        </div>

        <div className={styles.postsGrid} ref={gridRef}>
          {galleryColumns.map((column, columnIndex) => (
            <div className={styles.imageColumn} key={columnIndex}>
              {column.map(({ image, chronologicalIndex }) => (
                <div
                  onClick={() => onImageClick(sliceOffset + chronologicalIndex)}
                  style={{ cursor: 'pointer' }}
                  key={`${image.image.url}-${chronologicalIndex}`}
                  className={styles.galleryImage}
                >
                  <PrismicNextImage
                    field={image.image}
                    loading="lazy"
                    sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 400px"
                    imgixParams={{ q: 65, w: 400 }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryYear;
