import React, { Dispatch, SetStateAction } from 'react';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { CustomSlide, CustomSlideProps } from './CustomSlide';

type GalleryLightboxProps = {
  slides: { src: string; alt: string }[];
  lightboxOpen: boolean;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
  initialIndex?: number;
};

export default function GalleryLightbox({ slides, lightboxOpen, setLightboxOpen, initialIndex }: GalleryLightboxProps) {
  return (
    <Lightbox
      open={lightboxOpen}
      close={() => setLightboxOpen(false)}
      slides={slides}
      index={initialIndex}
      carousel={{ finite: false }}
      styles={{
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)',
          pointerEvents: 'all',
        },
      }}
      render={{
        slide: ({ slide }) => <CustomSlide slide={slide as CustomSlideProps} />,
      }}
    />
  );
}
