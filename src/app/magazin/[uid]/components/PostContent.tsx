'use client';

import React, { useState, useRef } from 'react';
import {
  InstagramIconDocument,
  MagazinpostDocument,
} from '../../../../../prismicio-types';

import styles from './PostContent.module.css';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import PostLightbox from './PostLightbox/PostLightbox';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import formatIsoToDate from '../../../../../helpers/formatIsoToDate';

type PostContentProps = {
  page: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
};

export default function PostContent({ page, instaIcon }: PostContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const galleryThreshhold = 4;

  const heroslice = page.data.slices.filter(
    (slice) => slice.slice_type === 'split_visual_headline',
  );

  const galleryImages = page.data.gallery;

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const scrollToIndex = (index: number) => {
    if (galleryRef.current) {
      const gallery = galleryRef.current;
      const images = gallery.querySelectorAll('img');
      if (images[index]) {
        const image = images[index] as HTMLElement;
        const scrollLeft =
          image.offsetLeft - gallery.offsetWidth / 2 + image.offsetWidth / 2;
        gallery.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
    setCurrentPreviewIndex(index);
  };

  const handlePrev = () => {
    const newIndex =
      currentPreviewIndex > 0
        ? currentPreviewIndex - 1
        : galleryImages.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentPreviewIndex < galleryImages.length - 1
        ? currentPreviewIndex + 1
        : 0;
    scrollToIndex(newIndex);
  };

  const handleDotClick = (index: number) => {
    scrollToIndex(index);
  };

  return (
    <div className={styles.container}>
      {heroslice && <SliceZone slices={heroslice} components={components} />}

      <div className={styles.contentcontainer}>
        <div className={styles.description}>
          <PrismicRichText field={page.data.post_description} />{' '}
          <div className={styles.aside}>
            <p>
              Artikel veröffentlicht am:{' '}
              {formatIsoToDate(page.data.publishing_date)}
            </p>
            <div className={styles.instaicon}>
              <PrismicNextLink field={page.data.instagram_link}>
                <PrismicNextImage field={instaIcon.data.instagram_icon} />
              </PrismicNextLink>
            </div>
          </div>
        </div>

        <div className={styles.galleryWrapper}>
          <div className={styles.galleryRow}>
            {galleryImages.length > galleryThreshhold && (
              <button
                className={styles.arrow}
                onClick={handlePrev}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <div className={styles.gallery} ref={galleryRef}>
              {galleryImages.map((item, index) => (
                <PrismicNextImage
                  field={item.image}
                  key={index}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>

            {galleryImages.length > galleryThreshhold && (
              <button
                className={styles.arrow}
                onClick={handleNext}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>

          {galleryImages.length > galleryThreshhold && (
            <div className={styles.dots}>
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentPreviewIndex ? styles.dotActive : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {lightboxOpen && (
          <PostLightbox
            page={page}
            lightboxOpen={lightboxOpen}
            setLightboxOpen={setLightboxOpen}
            initialIndex={activeIndex}
          />
        )}
      </div>
    </div>
  );
}
