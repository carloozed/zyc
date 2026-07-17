'use client';

import Lightbox from '@/app/components/Lightbox/Lightbox';
import { GallerySlide } from '@/helpers/gallery';

import DownloadIconGallery from './DownloadIconGallery';

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

type GalleryLightboxProps = {
  slides: GallerySlide[];
  open: boolean;
  onClose: () => void;
  index?: number;
};

export default function GalleryLightbox({
  slides,
  open,
  onClose,
  index,
}: GalleryLightboxProps) {
  return (
    <Lightbox
      slides={slides}
      open={open}
      onClose={onClose}
      index={index}
      renderActions={(slide) => (
        <button onClick={() => downloadImage(slide.src, slide.alt)}>
          <DownloadIconGallery />
        </button>
      )}
    />
  );
}
