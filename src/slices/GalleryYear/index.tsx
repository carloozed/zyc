import { useEffect, useState } from 'react';
import { FC } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

import styles from './index.module.css';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { PrismicNextImage } from '@prismicio/next';

/**
 * Props for `GalleryYear`.
 */
export type GalleryYearProps = SliceComponentProps<Content.GalleryYearSlice>;

/**
 * Component for "GalleryYear" Slices.
 */

type GallerySliceContext = {
  decoimage: Content.DecorationImageDocument;
};

const GalleryYear: FC<GalleryYearProps> = ({ slice, context }) => {
  const { decoimage } = context as GallerySliceContext;
  const [hasAppeared, setHasAppeared] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAppeared(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
              delay: !hasAppeared ? 2 : 0,
              duration: !hasAppeared ? 1.3 : 0,
            }}
            className={styles.title}
          >
            <PrismicRichText field={slice.primary.edition_year} />
          </FadeIn>
          <FadeIn
            className={styles.imagecontainer}
            vars={{
              delay: !hasAppeared ? 2.4 : 0,
              duration: !hasAppeared ? 1.6 : 0,
            }}
          >
            <PrismicNextImage field={decoimage.data.image} />
          </FadeIn>
        </div>

        <div className={styles.postsGrid}>
          {slice.primary.gallery.map((image, index) => (
            <div key={index}>
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
