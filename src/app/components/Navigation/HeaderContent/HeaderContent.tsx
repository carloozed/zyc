'use client';

import React, { useState, useEffect, useRef } from 'react';

import styles from './HeaderContent.module.css';

/* Component Imports */
import DownloadBar from './DownloadBar/DownloadBar';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import Hamburger from './Hamburger/Hamburger';

import { usePathname } from 'next/navigation';

export default function HeaderContent({ ...headerContentProps }) {
  const [isHome, setIsHome] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { navbar } = headerContentProps;
  const home = navbar.data.navigation_items[0].item;
  const { isOpen, setIsOpen, downloadbar, logo } = headerContentProps;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // If we're at the very top, always show navbar
    if (currentScrollY <= 100) {
      setShowNavbar(true);
    } else {
      // Check scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar after 100px
        if (currentScrollY > 100) {
          setShowNavbar(false);
        }
      } else {
        // Scrolling up - show navbar if scrolled up by at least 30px
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

    // Update when content might change
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
      style={{
        transform: `translateY(${showNavbar ? '0' : '-150%'})`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <PrismicNextLink field={home} onClick={() => setIsOpen(false)}>
        <div className={styles.header__logocontainer}>
          <PrismicNextImage field={logo.data.image} />
        </div>
      </PrismicNextLink>
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
