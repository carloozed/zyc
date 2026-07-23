import React from 'react';
import styles from './DescriptionComponent.module.css';
import { PrismicRichText } from '@prismicio/react';
import { Content, KeyTextField } from '@prismicio/client';

interface DescriptionComponentProps {
  slice: Content.ArtistsProgrammeSlice;
  activeElement: KeyTextField;
}

export default function DescriptionComponent({
  slice,
  activeElement,
}: DescriptionComponentProps) {
  return (
    <div className={styles.descriptions}>
      {slice.primary.descriptions.map((item, index) => {
        const isActive = item.id === activeElement;

        return (
          <div
            key={item.id || index}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            aria-hidden={!isActive}
          >
            <PrismicRichText field={item.title} />
            <div className={styles.description}>
              <PrismicRichText field={item.description} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
