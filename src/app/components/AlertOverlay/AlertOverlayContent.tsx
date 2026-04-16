'use client';

import { AlertoverlayDocument } from '@/prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import React, { useEffect, useState } from 'react';

import styles from './AlertOverlayContent.module.css';
import { PrismicNextImage } from '@prismicio/next';

type AlertOverlayProps = {
  overlay: AlertoverlayDocument;
};

export default function AlertOverlayContent({ overlay }: AlertOverlayProps) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const expiresAt = new Date('2026-04-19T14:00:00+02:00').getTime();
    if (Date.now() >= expiresAt) return;

    const timer = setTimeout(() => {
      setIsShown(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Enter') && isShown) {
        setIsShown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShown]);

  return (
    <div
      className={`${styles.overlaycontainer} ${isShown ? styles.overlaycontainer__shown : ''}`}
    >
      <div className={styles.overlaycontent}>
        <div
          className={styles.cross__container}
          onClick={() => setIsShown(false)}
        >
          <div className={styles.cross}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={styles.imagecontainer}>
          <PrismicNextImage field={overlay.data.decoimage} />
        </div>
        <div className={styles.uppercontainer}>
          <PrismicRichText field={overlay.data.title} />
          <PrismicRichText field={overlay.data.intro_text} />
        </div>
        <div className={styles.groupcontainer}>
          {overlay.data.information_group.map((item, index) => (
            <div key={index} className={styles.groupitem}>
              <PrismicRichText
                field={item.item_title}
                components={{
                  heading4: ({ children }) => <h3>{children}</h3>,
                }}
              />
              <PrismicRichText field={item.item_description} />
            </div>
          ))}
        </div>
        <PrismicRichText field={overlay.data.outro_text} />{' '}
        <div className={styles.imagecontainer}>
          <PrismicNextImage field={overlay.data.decoimage} />
        </div>
      </div>
    </div>
  );
}
