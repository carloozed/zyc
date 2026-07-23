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
  const shownElement = slice.primary.descriptions.find(
    (item) => item.id === activeElement,
  );

  if (!shownElement) return null;

  return (
    <div className={styles.descriptions}>
      <PrismicRichText field={shownElement.title} />
      <div className={styles.description}>
        <PrismicRichText field={shownElement.description} />
      </div>
    </div>
  );
}
