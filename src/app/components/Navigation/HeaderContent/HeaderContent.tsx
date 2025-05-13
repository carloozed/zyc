'use client';

import React, { useState, useEffect } from 'react';

import styles from './HeaderContent.module.css';
import { DownloadBarDocument } from '../../../../../prismicio-types';
import { LogoDocument } from '../../../../../prismicio-types';

/* Component Imports */
import DownloadBar from './DownloadBar/DownloadBar';
import { PrismicNextImage } from '@prismicio/next';
import Hamburger from './Hamburger/Hamburger';

import { usePathname } from 'next/navigation';

type Props = {
  downloadbar: DownloadBarDocument;
  logo: LogoDocument;
};

export default function HeaderContent({ downloadbar, logo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHome, setIsHome] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);

  const HamburgerProps = {
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  return (
    <div
      className={`${styles.header__content} ${isHovered || isOpen || !isHome ? ` ${styles.header__fullopacity}` : ''}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header__logocontainer}>
        <PrismicNextImage field={logo.data.image} />
      </div>
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
