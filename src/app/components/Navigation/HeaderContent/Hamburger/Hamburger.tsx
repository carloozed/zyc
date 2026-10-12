'use client';

import React, { RefObject } from 'react';

import styles from './Hamburger.module.css';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleRef?: RefObject<HTMLButtonElement | null>;
};

const LABELS = {
  'de-ch': { open: 'Menü öffnen', close: 'Menü schliessen' },
  'en-us': { open: 'Open menu', close: 'Close menu' },
};

export default function Hamburger({ isOpen, setIsOpen, toggleRef }: Props) {
  const locale = useLocaleFromPathname();

  const clickFunction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      type="button"
      ref={toggleRef}
      className={`${styles.hamburger__container} ${isOpen && styles.hamburger__open}`}
      onClick={clickFunction}
      aria-label={isOpen ? LABELS[locale].close : LABELS[locale].open}
      aria-expanded={isOpen}
      aria-controls={isOpen ? 'site-menu' : undefined}
    >
      <span className={styles.hamburger__line}>
        <span className={styles.circle}></span>
        <span className={styles.line}></span>
        <span className={styles.circle}></span>
      </span>
      <span className={styles.hamburger__line}>
        <span className={styles.circle}></span>
        <span className={styles.line}></span>
        <span className={styles.circle}></span>
      </span>
      <span className={styles.hamburger__line}>
        <span className={styles.circle}></span>
        <span className={styles.line}></span>
        <span className={styles.circle}></span>
      </span>
    </button>
  );
}
