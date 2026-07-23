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
    <Tag className={styles.wrapper} onMouseOver={onMouseOver}>
      <div className={styles.circle}></div>
      <PrismicRichText field={category && category.title} />
    </Tag>
  );
}
