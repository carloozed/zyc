import { useState } from 'react';

import Image from 'next/image';

import styles from './CustomSlide.module.css';

export type CustomSlideProps = {
  src: string;
  url: string;
  index: number;
  alt: string;
};

export function CustomSlide({ slide }: { slide: CustomSlideProps }) {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  return (
    <div className={styles.slide}>
      <Image
        src={slide.src}
        alt={slide.alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          opacity: isImageLoaded ? '1' : '0',
        }}
        width={1200}
        height={1200}
        unoptimized
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div
          style={{
            color: 'var(--green)',
            textAlign: 'center',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}
