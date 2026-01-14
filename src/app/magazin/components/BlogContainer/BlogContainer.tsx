import React from 'react';
import {
  InstagramIconDocument,
  MagazinpostDocument,
} from '../../../../../prismicio-types';

import styles from './BlogContainer.module.css';

import PostPreview from '../PostPreview/PostPreview';

type MagazinPostsProps = {
  magazinPosts: MagazinpostDocument[];
  instaIcon: InstagramIconDocument;
};

export default function BlogContainer({
  magazinPosts,
  instaIcon,
}: MagazinPostsProps) {
  return (
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
  );
}
