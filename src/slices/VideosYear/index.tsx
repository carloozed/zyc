'use client';

import { FC, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

import styles from './index.module.css';
import GallerySectionHeader from '@/app/components/GallerySectionHeader/GallerySectionHeader';
import useGalleryIntroAnimation from '@/helpers/useGalleryIntroAnimation';
import { GalleryPageContext, sortVideosByIndex } from '@/helpers/gallery';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type VideosYearProps = SliceComponentProps<Content.VideosYearSlice>;

type VideoItem = Content.VideosYearSliceDefaultPrimaryVideosItem;

function extractVimeoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

const VideoTile: FC<{ video: VideoItem }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const vimeoId = extractVimeoId(video.vimeo_url);

  const posterFallback = vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : null;

  const hasPoster = !!video.poster_image?.url;

  return (
    <div className={`video-fade ${styles.videoItem}`}>
      <div
        className={styles.videoFrame}
        onClick={() => !playing && vimeoId && setPlaying(true)}
        {...(!playing && {
          role: 'button',
          tabIndex: 0,
          'aria-label': video.title
            ? `Video abspielen: ${video.title}`
            : 'Video abspielen',
          onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
            if ((e.key === 'Enter' || e.key === ' ') && vimeoId) {
              e.preventDefault();
              setPlaying(true);
            }
          },
        })}
      >
        {playing && vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={video.title ?? 'Vimeo video'}
          />
        ) : (
          <>
            {hasPoster ? (
              <PrismicNextImage
                field={video.poster_image}
                className={styles.poster}
                loading="lazy"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 600px"
              />
            ) : posterFallback ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterFallback}
                alt={video.title ?? 'Video poster'}
                className={styles.poster}
                loading="lazy"
              />
            ) : (
              <div className={styles.posterFallback} />
            )}
            <div className={styles.playButton} aria-hidden="true" />
          </>
        )}
      </div>
      <div>
        <span className={styles.videoTitle}>
          <PrismicRichText
            field={video.performer}
            components={{
              heading3: ({ children }) => (
                <span className={styles.performer}>{children}</span>
              ),
            }}
          />
          <PrismicRichText
            field={video.age_and_instrument}
            components={{
              heading4: ({ children }) => (
                <span className={styles.ageAndInstrument}>{children}</span>
              ),
            }}
          />
        </span>
        <span className={styles.songtitle}>{video.song_title}</span>
      </div>
    </div>
  );
};

const VideosYear: FC<VideosYearProps> = ({ slice, context }) => {
  const { decoimage } = context as GalleryPageContext;
  const hasAnimated = useGalleryIntroAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const videos = useMemo(
    () => sortVideosByIndex(slice.primary.videos),
    [slice.primary.videos],
  );

  useGSAP(
    () => {
      // Each tile fades up as it scrolls into view.
      gsap.utils
        .toArray<HTMLElement>('.video-fade', sectionRef.current)
        .forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 1.2,
            ease: siteEase,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
    },
    { scope: sectionRef },
  );

  if (videos.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.blogcontainer}
    >
      <div className={styles.monthGroup}>
        <GallerySectionHeader
          editionYear={slice.primary.edition_year}
          decoimage={decoimage}
          hasAnimated={hasAnimated}
        />

        <div className={styles.videosGrid}>
          {videos.map((video, index) => (
            <VideoTile key={`${video.vimeo_url}-${index}`} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosYear;
