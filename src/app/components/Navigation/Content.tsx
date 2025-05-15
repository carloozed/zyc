'use client';

import React, { useState } from 'react';
import HeaderContent from './HeaderContent/HeaderContent';
import Menu from './Menu/Menu';

import {
  AddressDocument,
  NavbarDocument,
  NavigationIndicatorDocument,
  SubnavigationDocument,
  TimelineDocument,
} from '../../../../prismicio-types';
import { DownloadBarDocument } from '../../../../prismicio-types';
import { LogoDocument } from '../../../../prismicio-types';
import { LowNavigationDocument } from '../../../../prismicio-types';
import TimelineBroad from './TimelineBroad/TimelineBroad';

type Props = {
  downloadbar: DownloadBarDocument;
  logo: LogoDocument;
  styles: Record<string, string>;
  navbar: NavbarDocument;
  lownavigations: LowNavigationDocument[];
  address: AddressDocument;
  indicator: NavigationIndicatorDocument;
  subnavigation: SubnavigationDocument;
  timelineBroad: TimelineDocument;
};

export default function Content({
  downloadbar,
  logo,
  styles,
  navbar,
  lownavigations,
  address,
  indicator,
  subnavigation,
  timelineBroad,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const menuProps = {
    navbar: navbar,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    lownavigations: lownavigations,
    address: address,
    logo: logo,
    indicator: indicator,
    subnavigation: subnavigation,
  };

  const headerContentProps = {
    downloadbar: downloadbar,
    logo: logo,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    navbar: navbar,
  };

  const timelineProps = {
    timelineBroad: timelineBroad,
  };

  return (
    <>
      <div
        className={`${styles.header__maincontent} ${isOpen && styles.header__open}`}
      >
        <div className={styles.header__highercontent}>
          <HeaderContent {...headerContentProps} />
        </div>
        <div className={styles.header__lowercontent}>
          <Menu {...menuProps} />
        </div>
        <div className={styles.header__timeline}>
          <TimelineBroad {...timelineProps} />
        </div>
      </div>
    </>
  );
}
