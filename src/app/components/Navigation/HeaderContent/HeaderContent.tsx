'use client';

import React, { useState, useEffect, useRef } from 'react';

import styles from './HeaderContent.module.css';

/* Component Imports */
// import DownloadBar from './DownloadBar/DownloadBar';
import { PrismicNextImage } from '@prismicio/next';
import Hamburger from './Hamburger/Hamburger';

import { usePathname } from 'next/navigation';
import { TransitionLink } from '../../TransitionLink/TransitionLink';

import DownloadBar from './DownloadBar/DownloadBar';

export default function HeaderContent({ ...headerContentProps }) {
  const [isHome, setIsHome] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { navbar, downloadbar } = headerContentProps;
  const home = navbar.data.navigation_items[0].item;
  const { isOpen, setIsOpen, logo } = headerContentProps;

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          '--header-height',
          `${height}px`
        );
      }
    };

    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      resizeObserver.disconnect();
    };
  }, []);

  const HamburgerProps = {
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  return (
    <div
      className={`${styles.header__content} ${isHovered || isOpen || !isHome ? ` ${styles.header__fullopacity}` : ''}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={headerRef}
    >
      <TransitionLink
        field={home}
        onClick={() => setIsOpen(false)}
        hasText={false}
      >
        <div
          className={
            styles.header__logocontainer +
            (isHome ? ` ${styles.header__logo_home}` : '')
          }
        >
          <PrismicNextImage field={logo.data.image} />
        </div>
      </TransitionLink>
      <div className={styles.header__downloadbar}>
        {downloadbar.data.is_download_available !== 'Nichts' && (
          <DownloadBar downloadbar={downloadbar} />
        )}
      </div>
      <div className={styles.header__hamburger}>
        <Hamburger {...HamburgerProps} />
      </div>
    </div>
  );
}
