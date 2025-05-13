'use client';

import React, { useState } from 'react';
import HeaderContent from './HeaderContent/HeaderContent';
import Menu from './Menu/Menu';

import { NavbarDocument } from '../../../../prismicio-types';
import { DownloadBarDocument } from '../../../../prismicio-types';
import { LogoDocument } from '../../../../prismicio-types';

type Props = {
  downloadbar: DownloadBarDocument;
  logo: LogoDocument;
  styles: Record<string, string>;
  navbar: NavbarDocument;
};

export default function Content({ downloadbar, logo, styles, navbar }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const menuProps = {
    navbar: navbar,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  const headerContentProps = {
    downloadbar: downloadbar,
    logo: logo,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  return (
    <>
      <div className={styles.header__maincontent}>
        <div className={styles.header__highercontent}>
          <HeaderContent {...headerContentProps} />
        </div>
        <div className={styles.header__lowercontent}>
          <Menu {...menuProps} />
        </div>
      </div>
    </>
  );
}
