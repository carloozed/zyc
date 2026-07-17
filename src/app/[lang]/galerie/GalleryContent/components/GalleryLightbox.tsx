import React from 'react';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { CustomSlide } from './CustomSlide';
import { GallerySlide } from '@/helpers/gallery';

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
      open={open}
      close={onClose}
      slides={slides}
      index={index}
      carousel={{ finite: false }}
      styles={{
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)',
          pointerEvents: 'all',
        },
      }}
      render={{
        slide: ({ slide }) => <CustomSlide slide={slide as GallerySlide} />,
      }}
    />
  );
}
