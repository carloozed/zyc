'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

import styles from './index.module.css';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import useGalleryAnimationStore from '@/stores/GalleryAnimationStore';

export type VideosYearProps = SliceComponentProps<Content.VideosYearSlice>;

type VideosSliceContext = {
  decoimage: Content.DecorationImageDocument;
};

type VideoItem = Content.VideosYearSliceDefaultPrimaryVideosItem;

function extractVimeoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

function sortVideosByDate(videos: VideoItem[]) {
  return [...videos].sort((a, b) =>
    (b.date_added ?? '').localeCompare(a.date_added ?? ''),
  );
}

const VideoTile: FC<{ video: VideoItem }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const vimeoId = extractVimeoId(video.vimeo_url);

  const posterFallback = vimeoId
    ? `https://vumbnail.com/${vimeoId}.jpg`
    : null;

  const hasPoster = !!video.poster_image?.url;

  return (
    <div className={styles.videoItem}>
      <div
        className={styles.videoFrame}
        onClick={() => !playing && vimeoId && setPlaying(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && vimeoId && !playing) {
            e.preventDefault();
            setPlaying(true);
          }
        }}
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
      {video.title && <span className={styles.videoTitle}>{video.title}</span>}
    </div>
  );
};

const VideosYear: FC<VideosYearProps> = ({ slice, context }) => {
  const { decoimage } = context as VideosSliceContext;
  const { hasAnimated, setHasAnimated } = useGalleryAnimationStore();
  const videos = useMemo(
    () => sortVideosByDate(slice.primary.videos),
    [slice.primary.videos],
  );

  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAnimated, setHasAnimated]);

  if (videos.length === 0) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.blogcontainer}
    >
      <div className={styles.monthGroup}>
        <div className={styles.monthcontainer}>
          <FadeIn
            vars={{
              delay: !hasAnimated ? 1.2 : 0,
              duration: !hasAnimated ? 1.3 : 0,
            }}
            className={styles.title}
          >
            <PrismicRichText field={slice.primary.edition_year} />
          </FadeIn>
          <FadeIn
            className={styles.imagecontainer}
            vars={{
              delay: !hasAnimated ? 1.6 : 0,
              duration: !hasAnimated ? 1.6 : 0,
            }}
          >
            <PrismicNextImage field={decoimage.data.image} />
          </FadeIn>
        </div>

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
