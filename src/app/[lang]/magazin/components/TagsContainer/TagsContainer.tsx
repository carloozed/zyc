import React from 'react';

import styles from './TagsContainer.module.css';
import {
  MagazinpostDocument,
  MagazinpostDocumentDataTagsItem,
  Simplify,
} from '@/prismicio-types';

type Props = { post: MagazinpostDocument };

export default function TagsContainer({ post }: Props) {
  return (
    <div className={styles.tagscontainer}>
      {[...post.data.tags]
        .sort((a, b) => (a.item ?? '').localeCompare(b.item ?? ''))
        .map(
          (tag: Simplify<MagazinpostDocumentDataTagsItem>, index: number) => (
            <p key={`${index}-${tag.item}`}>{tag.item}</p>
          ),
        )}
    </div>
  );
}
