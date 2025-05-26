'use client';

import React, { useState, useEffect } from 'react';

import { DownloadBarDocument } from '../../../../../../prismicio-types';
import styles from './DownloadBar.module.css';
import { PrismicNextLink } from '@prismicio/next';

type Props = {
  downloadbar: DownloadBarDocument;
};

export default function DownloadBar({ downloadbar }: Props) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 100) {
      setShowNavbar(true);
    } else {
      if (currentScrollY > lastScrollY) {
        if (currentScrollY > 100) {
          setShowNavbar(false);
        }
      } else {
        if (lastScrollY - currentScrollY >= 30) {
          setShowNavbar(true);
        }
      }
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    let ticking = false;

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [lastScrollY]);
  return (
    <div
      className={styles.downloadbar__container}
      style={{
        transform: `translateY(${showNavbar ? '0' : '-150%'})`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <h5 className={styles.downloadbar__text}>
        {downloadbar.data.is_download_available === 'Stundenplan'
          ? `${downloadbar.data.schedule_is_available}`
          : downloadbar.data.is_download_available === 'Resultate'
            ? `${downloadbar.data.results_are_available}`
            : null}
      </h5>
      {downloadbar.data.is_download_available === 'Stundenplan' ? (
        <PrismicNextLink field={downloadbar.data.schedule_link} />
      ) : downloadbar.data.is_download_available === 'Resultate' ? (
        <PrismicNextLink field={downloadbar.data.results_link} />
      ) : null}
    </div>
  );
}
