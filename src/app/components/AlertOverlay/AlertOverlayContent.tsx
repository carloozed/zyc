import { AlertoverlayDocument } from '@/prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import React from 'react';

import styles from './AlertOverlayContent.module.css';
import { PrismicNextImage } from '@prismicio/next';

type AlertOverlayProps = {
  overlay: AlertoverlayDocument;
};

export default function AlertOverlayContent({ overlay }: AlertOverlayProps) {
  return (
    <div className={styles.overlaycontainer}>
      <div className={styles.overlaycontent}>
        <div className={styles.cross__container}>
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
