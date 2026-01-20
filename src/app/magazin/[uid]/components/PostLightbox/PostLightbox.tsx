'use client';

import React, { Dispatch, SetStateAction } from 'react';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { MagazinpostDocument } from '../../../../../../prismicio-types';
import { CustomSlide, CustomSlideProps } from './CustomSlide';

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
  const slides = page.data.gallery.map((item, index) => ({
    src: item.image.url as string,
    title: item.image.id,
    alt: item.image.alt as string,
    index: index,
  }));

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
