'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';

import styles from './PostContent.module.css';
import { JSXMapSerializer, PrismicRichText } from '@prismicio/react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import PostLightbox from './PostLightbox/PostLightbox';
import { toGalleryMedia } from './galleryMedia';

import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

import formatIsoToDate from '@/helpers/formatIsoToDate';

type PostContentProps = {
  page: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
};

export default function PostContent({ page, instaIcon }: PostContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const galleryThreshhold = !isMobile ? 3 : 2;

  const heroslice = page.data.slices.filter(
    (slice) => slice.slice_type === 'split_visual_headline',
  );

  // Only keep group items that carry an image or a video; an empty group or
  // placeholder rows would otherwise render a blank, fixed-height gallery.
  const galleryMedia = toGalleryMedia(page.data.gallery);
  const hasGallery = galleryMedia.length > 0;

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const scrollToIndex = (index: number) => {
    if (galleryRef.current) {
      const gallery = galleryRef.current;
      const item = gallery.children[index] as HTMLElement | undefined;
      if (item) {
        const scrollLeft =
          item.offsetLeft - gallery.offsetWidth / 2 + item.offsetWidth / 2;
        gallery.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
    setCurrentPreviewIndex(index);
  };

  const handlePrev = () => {
    const newIndex =
      currentPreviewIndex > 0
        ? currentPreviewIndex - 1
        : galleryMedia.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentPreviewIndex < galleryMedia.length - 1
        ? currentPreviewIndex + 1
        : 0;
    scrollToIndex(newIndex);
  };

  const handleDotClick = (index: number) => {
    scrollToIndex(index);
  };

  const richtextcomponents: JSXMapSerializer = {
    preformatted: ({ children }) => (
      <blockquote className={styles.quotecontainer}>
        <span className={styles.quote}>{children}</span>
      </blockquote>
    ),
  };

  return (
    <div className={`page-container ${styles.container}`}>
      {heroslice && <SliceZone slices={heroslice} components={components} />}

      <div className={styles.contentcontainer}>
        <div className={styles.description}>
          <PrismicRichText
            field={page.data.post_description}
            components={richtextcomponents}
          />{' '}
          <div className={styles.aside}>
            <p>
              Artikel veröffentlicht am:{' '}
              {formatIsoToDate(page.data.publishing_date)}
            </p>
            {page.data.has_instagram && (
              <div className={styles.instaicon}>
                <PrismicNextLink field={page.data.instagram_link}>
                  <PrismicNextImage field={instaIcon.data.instagram_icon} />
                </PrismicNextLink>
              </div>
            )}
          </div>
        </div>

        {hasGallery && (
          <div className={styles.galleryWrapper}>
            <div className={styles.galleryRow}>
              {galleryMedia.length > galleryThreshhold && (
                <button
                  className={styles.arrow}
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}

              <div className={styles.gallery} ref={galleryRef}>
                {galleryMedia.map((item, index) =>
                  item.kind === 'image' ? (
                    <PrismicNextImage
                      field={item.image}
                      key={index}
                      onClick={() => handleImageClick(index)}
                    />
                  ) : (
                    <button
                      type="button"
                      key={index}
                      className={styles.videoThumb}
                      onClick={() => handleImageClick(index)}
                      aria-label={item.alt || 'Video abspielen'}
                    >
                      {/* With a poster nothing is fetched until the lightbox
                          plays it; without one the first frame is shown. */}
                      <video
                        src={item.poster ? item.src : `${item.src}#t=0.1`}
                        poster={item.poster}
                        preload={item.poster ? 'none' : 'metadata'}
                        muted
                        playsInline
                        tabIndex={-1}
                      />
                      <span className={styles.playIcon} aria-hidden="true" />
                    </button>
                  ),
                )}
              </div>

              {galleryMedia.length > galleryThreshhold && (
                <button
                  className={styles.arrow}
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>

            {galleryMedia.length > galleryThreshhold && (
              <div className={styles.dots}>
                {galleryMedia.map((_, index) => (
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
        )}

        {hasGallery && lightboxOpen && (
          <PostLightbox
            media={galleryMedia}
            lightboxOpen={lightboxOpen}
            setLightboxOpen={setLightboxOpen}
            initialIndex={activeIndex}
          />
        )}
      </div>
    </div>
  );
}
