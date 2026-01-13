import React from 'react';

import styles from './MagazineContent.module.css';
import {
  InstagramIconDocument,
  MagazinDocument,
  MagazinpostDocument,
} from '../../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import PostPreview from './PostPreview/PostPreview';

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
  return (
    <div className={styles.container}>
      <div className={styles.uppercontainer}>
        <div className={styles.titleContainer}>
          <PrismicRichText field={page.data.title} />
        </div>
        <div className={styles.filtercontainer}>
          <div className={styles.sortcontainer}>
            <h4>Sortieren nach:</h4>
            <select>
              {page.data.sorting_options.map((item, index) => (
                <option key={`${index}-${item.item}`}>{item.item}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterbar}>
            <h4>Filter: </h4>
            {page.data.filter_options.map((item, index) => (
              <button key={`${index}-${item.item}`}>{item.item}</button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.blogcontainer}>
        {magazinPosts.map((post, index) => (
          <PostPreview
            post={post}
            index={index}
            key={index}
            instaIcon={instaIcon}
          />
        ))}
      </div>
    </div>
  );
}
