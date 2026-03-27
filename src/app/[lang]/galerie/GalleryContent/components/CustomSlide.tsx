import { useState } from 'react';

import Image from 'next/image';

import styles from './CustomSlide.module.css';
import DownloadIconGallery from './DownloadIconGallery';

export type CustomSlideProps = {
  src: string;
  url: string;
  index: number;
  alt: string;
};

export function CustomSlide({ slide }: { slide: CustomSlideProps }) {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  async function handleDownload(url: string, filename: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  console.log(slide);

  return (
    <div className={styles.slide}>
      <span className={styles.slidespan}>
        <Image
          src={slide.src}
          alt={slide.alt}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            opacity: isImageLoaded ? '1' : '0',
          }}
          width={800}
          height={800}
          unoptimized
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setHasError(true)}
        />
        <button onClick={() => handleDownload(slide.src, slide.alt)}>
          <DownloadIconGallery />
        </button>
      </span>
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
