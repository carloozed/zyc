import { useState } from 'react';

import Image from 'next/image';

import styles from './CustomSlide.module.css';
import DownloadIconGallery from './DownloadIconGallery';
import { GallerySlide } from '@/helpers/gallery';

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}

export function CustomSlide({ slide }: { slide: GallerySlide }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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
        <button onClick={() => downloadImage(slide.src, slide.alt)}>
          <DownloadIconGallery />
        </button>
      </span>
      {hasError && <div className={styles.error}>Failed to load image</div>}
    </div>
  );
}
