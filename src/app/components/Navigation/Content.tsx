'use client';

import React, { useState, useRef, useEffect } from 'react';
import HeaderContent from './HeaderContent/HeaderContent';
import Menu from './Menu/Menu';

import {
  AddressDocument,
  NavbarDocument,
  NavigationIndicatorDocument,
  SubnavigationDocument,
  TermineIsVisibleDocument,
  TimelineDocument,
  DownloadBarDocument,
  LogoDocument,
  LowNavigationDocument,
} from '@/prismicio-types';

import TimelineBroad from './TimelineBroad/TimelineBroad';

type Props = {
  downloadbar: DownloadBarDocument;
  logo: LogoDocument;
  styles: Record<string, string>;
  navbar: NavbarDocument;
  lownavigations: LowNavigationDocument[];
  lowNavigation: LowNavigationDocument | undefined;
  address: AddressDocument;
  indicator: NavigationIndicatorDocument;
  subnavigation: SubnavigationDocument;
  timelineBroad: TimelineDocument;
  termineIsVisible: TermineIsVisibleDocument;
};

export default function Content({
  downloadbar,
  logo,
  styles,
  navbar,
  lownavigations,
  lowNavigation,
  address,
  indicator,
  subnavigation,
  timelineBroad,
  termineIsVisible,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // While the menu is open it covers the page: everything outside the header
  // becomes inert so Tab can't wander into hidden content, and Escape closes
  // the menu and hands focus back to the toggle.
  useEffect(() => {
    if (!isOpen) return;

    const inerted: HTMLElement[] = [];
    let node: HTMLElement | null = containerRef.current;
    while (node && node !== document.body) {
      const parent: HTMLElement | null = node.parentElement;
      for (const sibling of Array.from(parent?.children ?? [])) {
        if (
          sibling !== node &&
          sibling instanceof HTMLElement &&
          !sibling.inert
        ) {
          sibling.inert = true;
          inerted.push(sibling);
        }
      }
      node = parent;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      inerted.forEach((element) => (element.inert = false));
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const menuProps = {
    navbar: navbar,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    lownavigations: lownavigations,
    lowNavigation: lowNavigation,
    address: address,
    logo: logo,
    indicator: indicator,
    subnavigation: subnavigation,
    termineIsVisible: termineIsVisible,
  };

  const headerContentProps = {
    downloadbar: downloadbar,
    logo: logo,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    navbar: navbar,
    toggleRef: toggleRef,
  };

  const timelineProps = {
    timelineBroad: timelineBroad,
  };

  return (
    <>
      <div
        ref={containerRef}
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
