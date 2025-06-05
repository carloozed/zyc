import React from 'react';

import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  return (
    <div className={styles.splashscreen}>
      <div className={styles.splashscreen__content}>
        <div className={styles.decor}>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
        </div>
        <div>
          <h1>Zurich Youth Classical</h1>
          <h2>coming soon</h2>
        </div>
        <div className={styles.decor}>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    </div>
  );
}
