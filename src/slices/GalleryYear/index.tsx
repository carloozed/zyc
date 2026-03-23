import { useEffect, useRef } from 'react';
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

const GalleryYear: FC<GalleryYearProps> = ({ slice, context }) => {
  const { decoimage, onImageClick, sliceOffsets, filter } =
    context as GallerySliceContext;
  const { hasAnimated, setHasAnimated } = useGalleryAnimationStore();
  const sliceOffset = sliceOffsets.get(slice.id) ?? 0;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAnimated, setHasAnimated]);

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
    { scope: gridRef, dependencies: [filter] },
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
          {slice.primary.gallery
            .filter((image) => !filter || image.eventtag?.toLowerCase() === filter)
            .map((image, index) => (
            <div
              onClick={() => onImageClick(sliceOffset + index)}
              style={{ cursor: 'pointer' }}
              key={index}
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
      </div>
    </section>
  );
};

export default GalleryYear;
