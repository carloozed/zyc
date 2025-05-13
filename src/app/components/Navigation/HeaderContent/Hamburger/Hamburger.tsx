'use client';

import React from 'react';

import styles from './Hamburger.module.css';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Hamburger({ isOpen, setIsOpen }: Props) {
  const clickFunction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.hamburger__container} ${isOpen && styles.hamburger__open}`}
      onClick={clickFunction}
    >
      <div className={styles.hamburger__line}>
        <div className={styles.circle}></div>
        <div className={styles.line}></div>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.hamburger__line}>
        <div className={styles.circle}></div>
        <div className={styles.line}></div>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.hamburger__line}>
        <div className={styles.circle}></div>
        <div className={styles.line}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
}
