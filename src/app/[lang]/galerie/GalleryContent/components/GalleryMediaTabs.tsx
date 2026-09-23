'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './GalleryMediaTabs.module.css';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import {
  GALLERY_VIEW_PARAM,
  GalleryMediaType,
  mediaTypeFromParam,
} from '@/helpers/gallery';

const MEDIA_TYPE_TABS: GalleryMediaType[] = ['photos', 'videos'];

const MEDIA_TYPE_LABELS: Record<
  GalleryMediaType,
  { 'de-ch': string; 'en-us': string }
> = {
  photos: { 'de-ch': 'Fotos', 'en-us': 'Photos' },
  videos: { 'de-ch': 'Videos', 'en-us': 'Videos' },
};

type GalleryMediaTabsProps = {
  lang: string;
};

export default function GalleryMediaTabs({ lang }: GalleryMediaTabsProps) {
  const searchParams = useSearchParams();
  const mediaType = mediaTypeFromParam(searchParams.get(GALLERY_VIEW_PARAM));
  const labelLang = lang === 'en-us' ? 'en-us' : 'de-ch';

  // replaceState instead of router.replace: Next syncs useSearchParams with
  // it, so the view switches in place without a server round trip. Not
  // pushState: next-view-transitions starts a view transition on popstate and
  // only ends it on a pathname change, so a back step between two query
  // strings froze the page until the browser timed the transition out.
  const selectMediaType = (tab: GalleryMediaType) => {
    if (tab === mediaType) return;
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'videos') params.set(GALLERY_VIEW_PARAM, tab);
    else params.delete(GALLERY_VIEW_PARAM);
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      query ? `?${query}` : window.location.pathname,
    );
  };

  return (
    <div className={styles.clip}>
      <FadeIn className={styles.tabs} vars={{ duration: 1.2, delay: 1 }}>
        {MEDIA_TYPE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={mediaType === tab}
            onClick={() => selectMediaType(tab)}
            className={`${styles.tab} ${mediaType === tab ? styles.active : ''}`}
          >
            {MEDIA_TYPE_LABELS[tab][labelLang]}
          </button>
        ))}
      </FadeIn>
    </div>
  );
}
