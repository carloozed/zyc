'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './GalleryMediaTabs.module.css';

import {
  GALLERY_MEDIA_LABELS,
  GALLERY_MEDIA_TYPES,
  GALLERY_VIEW_PARAM,
  GalleryMediaType,
  mediaTypeFromParam,
} from '@/helpers/gallery';

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
    <div className={styles.tabs}>
      {GALLERY_MEDIA_TYPES.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-pressed={mediaType === tab}
          onClick={() => selectMediaType(tab)}
          className={`${styles.tab} ${mediaType === tab ? styles.active : ''}`}
        >
          {GALLERY_MEDIA_LABELS[tab][labelLang]}
        </button>
      ))}
    </div>
  );
}
