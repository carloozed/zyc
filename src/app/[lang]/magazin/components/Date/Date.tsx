import { MagazinpostDocument } from '@/prismicio-types';
import React from 'react';

type DateProps = {
  post: MagazinpostDocument;
};

import styles from './Date.module.css';
import formatIsoToDate from '@/helpers/formatIsoToDate';

export default function PostDate({ post }: DateProps) {
  return (
    <p className={styles.date}>
      {formatIsoToDate(post.data.publishing_date as string)}
    </p>
  );
}
