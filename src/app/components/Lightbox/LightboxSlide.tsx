import { ReactNode, useState } from 'react';

import Image from 'next/image';

import { GallerySlide } from '@/helpers/gallery';

import styles from './LightboxSlide.module.css';

type LightboxSlideProps = {
  slide: GallerySlide;
  /**
   * Optional per-slide controls (e.g. a download button) rendered next to the
   * image. When present the slide uses the wider gallery layout; without it the
   * bare magazin layout is used.
   */
  actions?: ReactNode;
};

export default function LightboxSlide({ slide, actions }: LightboxSlideProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (actions) {
    return (
      <div className={styles.slide}>
        <span className={styles.slidespan}>
          <Image
            src={slide.src}
            alt={slide.alt}
            className={`${styles.image} ${isImageLoaded ? styles.loaded : ''}`}
            width={800}
            height={800}
            unoptimized
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setHasError(true)}
          />
          {actions}
        </span>
        {hasError && <div className={styles.error}>Failed to load image</div>}
      </div>
    );
  }

  return (
    <div className={styles.slidePost}>
      <Image
        src={slide.src}
        alt={slide.alt}
        className={`${styles.image} ${isImageLoaded ? styles.loaded : ''}`}
        width={1200}
        height={1200}
        unoptimized
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && <div className={styles.error}>Failed to load image</div>}
    </div>
  );
}
