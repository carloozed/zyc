'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  DecorationImageDocument,
  InstagramIconDocument,
  MagazinpostDocument,
} from '../../../../../prismicio-types';

import styles from './BlogContainer.module.css';
import PostPreview from '../PostPreview/PostPreview';
import useFilterStore from '@/stores/FilterStore';
import { PrismicNextImage } from '@prismicio/next';
import FadeIn from '@/app/components/FadeIn/FadeIn';

type MagazinPostsProps = {
  magazinPosts: MagazinpostDocument[];
  instaIcon: InstagramIconDocument;
  decoimage: DecorationImageDocument;
};

// Group posts by month/year
function groupPostsByMonth(posts: MagazinpostDocument[]) {
  const grouped: Record<string, MagazinpostDocument[]> = {};

  posts.forEach((post) => {
    const date = post.data.publishing_date
      ? new Date(post.data.publishing_date)
      : null;

    if (date) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(post);
    }
  });

  // Sort keys by date (newest first)
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearB - yearA || monthB - monthA;
  });

  return sortedKeys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    const label = new Date(year, month).toLocaleDateString('de-CH', {
      month: 'long',
      year: 'numeric',
    });
    return { label, posts: grouped[key] };
  });
}

export default function BlogContainer({
  magazinPosts,
  instaIcon,
  decoimage,
}: MagazinPostsProps) {
  const { filter } = useFilterStore();

  const [mappingArray, setMappingArray] =
    useState<MagazinpostDocument[]>(magazinPosts);

  useEffect(() => {
    if (!filter) {
      setMappingArray(
        [...magazinPosts].sort((a, b) =>
          (b.data.publishing_date ?? '').localeCompare(a.data.publishing_date ?? ''),
        ),
      );
    } else {
      setMappingArray(
        magazinPosts.filter((post) =>
          post.data.tags.some((tag) => tag.item?.toLowerCase() === filter),
        ),
      );
    }
  }, [filter, magazinPosts]);

  const groupedPosts = useMemo(
    () => groupPostsByMonth(mappingArray),
    [mappingArray],
  );

  return (
    <div className={styles.blogcontainer}>
      {groupedPosts.map((group) => (
        <div key={group.label} className={styles.monthGroup}>
          <div className={styles.monthcontainer}>
            <FadeIn vars={{ delay: 2, duration: 1.3 }} className={styles.title}>
              <h2 className={styles.monthHeader}>{group.label}</h2>
            </FadeIn>
            <FadeIn
              className={styles.imagecontainer}
              vars={{ delay: 2.4, duration: 1.6 }}
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
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
