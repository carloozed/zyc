'use client';

import React, { useState, useEffect } from 'react';
import {
  DecorationImageDocument,
  InstagramIconDocument,
  MagazinpostDocument,
} from '../../../../../../prismicio-types';

import styles from './BlogContainer.module.css';
import PostPreview from '../PostPreview/PostPreview';
import { PrismicNextImage } from '@prismicio/next';
import FadeIn from '@/app/components/FadeIn/FadeIn';

type GroupPost = {
  posts: MagazinpostDocument[];
  label: string;
};

type MagazinPostsProps = {
  instaIcon: InstagramIconDocument;
  decoimage: DecorationImageDocument;
  groupedPosts: GroupPost[];
};

export default function BlogContainer({
  instaIcon,
  decoimage,
  groupedPosts,
}: MagazinPostsProps) {
  const [hasAppeared, setHasAppeared] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAppeared(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.blogcontainer}>
      {groupedPosts.map((group) => (
        <div key={group.label} className={styles.monthGroup}>
          <div className={styles.monthcontainer}>
            <FadeIn
              vars={{
                delay: !hasAppeared ? 2 : 0,
                duration: !hasAppeared ? 1.3 : 0,
              }}
              className={styles.title}
            >
              <h2 className={styles.monthHeader}>{group.label}</h2>
            </FadeIn>
            <FadeIn
              className={styles.imagecontainer}
              vars={{
                delay: !hasAppeared ? 2.4 : 0,
                duration: !hasAppeared ? 1.6 : 0,
              }}
            >
              <PrismicNextImage field={decoimage.data.image} />
            </FadeIn>
          </div>

          <div className={styles.postsGrid}>
            {group.posts.map((post, index) => (
              <PostPreview
                post={post}
                index={index}
                key={post.id}
                instaIcon={instaIcon}
                hasAppeared={hasAppeared}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
