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
  onMouseOver?: () => void;
}

export default function CategoryWrapper({
  category,
  as: Tag = 'li',
  onMouseOver,
}: CategoryWrapperProps) {
  return (
    <Tag className={styles.clip} onMouseOver={onMouseOver}>
      {/* .category-slide is animated by ArtistProgrammeContent; the outer
          clip masks it so the card is invisible until it slides up. */}
      <div className={`category-slide ${styles.wrapper}`}>
        <div className={styles.circle}></div>
        <PrismicRichText field={category && category.title} />
      </div>
    </Tag>
  );
}
