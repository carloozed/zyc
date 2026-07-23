import React from 'react';
import styles from './CategoryWrapper.module.css';
import {
  ArtistsProgrammeSliceDefaultPrimaryCategoriesItem,
  Simplify,
} from '@/prismicio-types';
import { PrismicRichText } from '@prismicio/react';

interface CategoryWrapperProps {
  category:
    | Simplify<ArtistsProgrammeSliceDefaultPrimaryCategoriesItem>
    | undefined;
  as?: React.ElementType;
  onSelect?: () => void;
}

export default function CategoryWrapper({
  category,
  as: Tag = 'li',
  onSelect,
}: CategoryWrapperProps) {
  if (!category) return null;

  return (
    <Tag className={styles.clip}>
      {/* .category-slide is animated by ArtistProgrammeContent; the outer
          clip masks it so the card is invisible until it slides up.
          A real button so touch and keyboard users can switch categories;
          the title renders as a span because buttons only allow phrasing
          content (styled to match the global h3 look). */}
      <button
        type="button"
        className={`category-slide ${styles.wrapper}`}
        onClick={onSelect}
        onFocus={onSelect}
        onMouseOver={onSelect}
      >
        <div className={styles.circle}></div>
        <PrismicRichText
          field={category.title}
          components={{
            heading3: ({ children }) => (
              <span className={styles.cardTitle}>{children}</span>
            ),
          }}
        />
      </button>
    </Tag>
  );
}
