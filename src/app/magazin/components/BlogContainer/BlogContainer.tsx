'use client';

import React, { useMemo, useState, useEffect } from 'react';
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

import useSortingStore from '@/stores/SortingStore';

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
  const { sorting } = useSortingStore();
  const [hasAppeared, setHasAppeared] = useState<boolean>(false);
  const filteredPosts = useMemo(() => {
    const sorted = [...magazinPosts].sort((a, b) =>
      (b.data.publishing_date ?? '').localeCompare(
        a.data.publishing_date ?? '',
      ),
    );
    if (!filter) return sorted;
    return sorted.filter((post) =>
      post.data.tags.some((tag) => tag.item?.toLowerCase() === filter),
    );
  }, [filter, magazinPosts]);

  const groupedPosts = useMemo(() => {
    const groups = groupPostsByMonth(filteredPosts);
    return sorting === 'neu' ? groups : [...groups].reverse();
  }, [filteredPosts, sorting]);

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
