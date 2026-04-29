'use client';

import React from 'react';

import styles from './MagazineContent.module.css';
import {
  DecorationImageDocument,
  InstagramIconDocument,
  MagazinDocument,
  MagazinpostDocument,
} from '@/prismicio-types';

import BlogContainer from './BlogContainer/BlogContainer';
import FilterContainer from './FilterContainer/FilterContainer';
import { RevealText } from '@/app/components/RevealText/RevealText';
import FadeIn from '@/app/components/FadeIn/FadeIn';
import useFilterStore from '@/stores/FilterStore';
import useSortingStore from '@/stores/SortingStore';
import HighlightedPost from './HighlightedPost/HighlightedPost';
import StickyContainer from './StickyContainer/StickyContainer';

type MagazineContentProps = {
  page: MagazinDocument;
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

const FOCUS_TAG = 'fokus';

export default function MagazineContent({
  page,
  magazinPosts,
  instaIcon,
  decoimage,
}: MagazineContentProps) {
  const filter = useFilterStore((s) => s.filter);
  const sorting = useSortingStore((s) => s.sorting);

  const filters = [
    ...new Set(
      magazinPosts.flatMap((post) => post.data.tags.map((tag) => tag.item)),
    ),
  ];

  const sortedPosts = [...magazinPosts].sort((a, b) =>
    (b.data.publishing_date ?? '').localeCompare(a.data.publishing_date ?? ''),
  );

  const filteredPosts = filter
    ? sortedPosts.filter((post) =>
        post.data.tags.some((tag) => tag.item?.toLowerCase() === filter),
      )
    : sortedPosts;

  const groups = groupPostsByMonth(filteredPosts);
  const groupedPosts = sorting === 'neu' ? groups : [...groups].reverse();

  const highlightedPosts = magazinPosts
    .filter((post) => post.tags.includes(FOCUS_TAG))
    .sort((a, b) =>
      (b.data.publishing_date ?? '').localeCompare(
        a.data.publishing_date ?? '',
      ),
    );

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

          <FadeIn
            vars={{
              delay: 2,
              duration: 1.3,
              y: 0,
            }}
            className={styles.number}
          >
            <h5>({filteredPosts.length})</h5>
          </FadeIn>
        </div>
      </div>
      {highlightedPosts.length > 0 && (
        <div className={styles.highlights}>
          <StickyContainer>
            <FadeIn
              className={styles.focus}
              vars={{
                duration: 1.2,
                delay: 1,
              }}
            >
              <div className={styles.focuscontainer}>
                <h3>Im Fokus</h3>
                <h5>({highlightedPosts.length})</h5>
              </div>
            </FadeIn>
          </StickyContainer>

          <div className={styles.highlightedposts}>
            {highlightedPosts.map((post, index) => (
              <HighlightedPost
                variant={index % 2 === 0 ? 'wide' : 'narrow'}
                key={`${post.id}-${index}`}
                post={post}
                instaIcon={instaIcon}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.lowercontainer}>
        <StickyContainer>
          <FilterContainer page={page} filters={filters} />
        </StickyContainer>
        <BlogContainer
          instaIcon={instaIcon}
          decoimage={decoimage}
          groupedPosts={groupedPosts}
        />
      </div>
    </div>
  );
}
