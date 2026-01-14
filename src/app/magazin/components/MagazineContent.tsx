import React from 'react';

import styles from './MagazineContent.module.css';
import {
  InstagramIconDocument,
  MagazinDocument,
  MagazinpostDocument,
} from '../../../../prismicio-types';
import BlogContainer from './BlogContainer/BlogContainer';
import FilterContainer from './FilterContainer/FilterContainer';
import { RevealText } from '@/app/components/RevealText/RevealText';

type MagazineContentProps = {
  page: MagazinDocument;
  magazinPosts: MagazinpostDocument[];
  instaIcon: InstagramIconDocument;
};

export default function MagazineContent({
  page,
  magazinPosts,
  instaIcon,
}: MagazineContentProps) {
  console.log(magazinPosts);

  return (
    <div className={styles.container}>
      <div className={styles.uppercontainer}>
        <div className={styles.titleContainer}>
          <RevealText
            field={page.data.title}
            staggerAmount={0.2}
            duration={1.2}
            delay={1.0}
            as={'h1'}
          />
        </div>
      </div>
      <div className={styles.lowercontainer}>
        <div className={styles.filter}>
          <FilterContainer page={page} />
        </div>
        <BlogContainer magazinPosts={magazinPosts} instaIcon={instaIcon} />
      </div>
    </div>
  );
}
