'use client';

import React, { Dispatch, SetStateAction } from 'react';

import Lightbox, { Slide } from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import { GalleryMedia } from '../galleryMedia';
import { CustomSlide, CustomSlideProps } from './CustomSlide';

type LightboxProps = {
  media: GalleryMedia[];
  lightboxOpen: boolean;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
  initialIndex?: number;
};

export default function PostLightbox({
  media,
  lightboxOpen,
  setLightboxOpen,
  initialIndex = 0,
}: LightboxProps) {
  const magazinslides = media.map(
    (item): Slide =>
      item.kind === 'video'
        ? {
            type: 'video',
            sources: [{ src: item.src, type: item.type }],
            poster: item.poster,
          }
        : {
            src: item.image.url as string,
            alt: item.image.alt as string,
          },
  );

  return (
    <Lightbox
      open={lightboxOpen}
      close={() => setLightboxOpen(false)}
      slides={magazinslides}
      index={initialIndex}
      carousel={{ finite: false }}
      plugins={[Video]}
      video={{ autoPlay: true, controls: true, playsInline: true }}
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
