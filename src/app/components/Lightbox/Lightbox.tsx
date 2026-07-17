'use client';

import { ReactNode } from 'react';

import ReactLightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { GallerySlide } from '@/helpers/gallery';

import LightboxSlide from './LightboxSlide';

type LightboxProps = {
  slides: GallerySlide[];
  open: boolean;
  onClose: () => void;
  index?: number;
  /**
   * Renders per-slide controls (e.g. a download button) inside each slide.
   * Call sites that omit it get the bare image slide.
   */
  renderActions?: (slide: GallerySlide) => ReactNode;
};

export default function Lightbox({
  slides,
  open,
  onClose,
  index,
  renderActions,
}: LightboxProps) {
  return (
    <ReactLightbox
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
        slide: ({ slide }) => (
          <LightboxSlide
            slide={slide as GallerySlide}
            actions={renderActions?.(slide as GallerySlide)}
          />
        ),
      }}
    />
  );
}
