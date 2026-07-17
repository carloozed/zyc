'use client';

import { useEffect } from 'react';

import useGalleryStore from '@/stores/GalleryStore';

const INTRO_ANIMATION_DURATION_MS = 3000;

/**
 * The gallery intro animation plays once per session; afterwards slices
 * render without entrance delays. Returns whether the intro already ran.
 */
const useGalleryIntroAnimation = () => {
  const hasAnimated = useGalleryStore((state) => state.hasAnimated);
  const setHasAnimated = useGalleryStore((state) => state.setHasAnimated);

  useEffect(() => {
    if (hasAnimated) return;
    const timer = setTimeout(
      () => setHasAnimated(true),
      INTRO_ANIMATION_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [hasAnimated, setHasAnimated]);

  return hasAnimated;
};

export default useGalleryIntroAnimation;
