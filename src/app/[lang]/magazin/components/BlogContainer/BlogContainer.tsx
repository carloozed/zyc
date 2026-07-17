'use client';

import React from 'react';
import {
  DecorationImageDocument,
  InstagramIconDocument,
} from '@/prismicio-types';

import styles from './BlogContainer.module.css';
import PostPreview from '../PostPreview/PostPreview';
import { PrismicNextImage } from '@prismicio/next';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import { PostMonthGroup } from '@/helpers/magazin';

type MagazinPostsProps = {
  instaIcon: InstagramIconDocument;
  decoimage: DecorationImageDocument;
  groupedPosts: PostMonthGroup[];
  hasAppeared: boolean;
};

export default function BlogContainer({
  instaIcon,
  decoimage,
  groupedPosts,
  hasAppeared,
}: MagazinPostsProps) {
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
