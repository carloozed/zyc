'use client';

import React, { useEffect, useState } from 'react';
import {
  InstagramIconDocument,
  MagazinpostDocument,
} from '../../../../../prismicio-types';

import styles from './BlogContainer.module.css';

import PostPreview from '../PostPreview/PostPreview';

import useFilterStore from '@/stores/FilterStore';

type MagazinPostsProps = {
  magazinPosts: MagazinpostDocument[];
  instaIcon: InstagramIconDocument;
};

export default function BlogContainer({
  magazinPosts,
  instaIcon,
}: MagazinPostsProps) {
  const { filter } = useFilterStore();

  const [mappingArray, setMappingArray] =
    useState<MagazinpostDocument[]>(magazinPosts);

  useEffect(() => {
    if (!filter) {
      setMappingArray(magazinPosts);
    } else {
      setMappingArray(
        magazinPosts.filter((post) =>
          post.data.tags.some((tag) => tag.item?.toLowerCase() === filter)
        )
      );
    }
  }, [filter, magazinPosts]);

  return (
    <div className={styles.blogcontainer}>
      {mappingArray.map((post, index) => (
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
