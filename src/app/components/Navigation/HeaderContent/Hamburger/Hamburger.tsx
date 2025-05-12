import React from 'react';

import styles from './Hamburger.module.css';

type Props = {};

export default function Hamburger({}: Props) {
  return (
    <div className={styles.hamburger__container}>
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
