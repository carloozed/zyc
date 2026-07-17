'use client';

import { Dispatch, SetStateAction } from 'react';

import Lightbox from '@/app/components/Lightbox/Lightbox';
import { GallerySlide } from '@/helpers/gallery';
import { MagazinpostDocument } from '@/prismicio-types';

type LightboxProps = {
  page: MagazinpostDocument;
  lightboxOpen: boolean;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
  initialIndex?: number;
};

export default function PostLightbox({
  page,
  lightboxOpen,
  setLightboxOpen,
  initialIndex = 0,
}: LightboxProps) {
  const slides: GallerySlide[] = page.data.gallery.map((item) => ({
    src: item.image.url as string,
    alt: item.image.alt as string,
  }));

  return (
    <Lightbox
      slides={slides}
      open={lightboxOpen}
      onClose={() => setLightboxOpen(false)}
      index={initialIndex}
    />
  );
}
