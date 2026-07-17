'use client';

import React, { useEffect, useMemo, useState } from 'react';

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
import PostPreview from './PostPreview/PostPreview';
import {
  filterPostsByTag,
  getHighlightedPosts,
  getUniquePostTags,
  groupPostsByMonth,
  sortPostsByDateDesc,
} from '@/helpers/magazin';

type MagazineContentProps = {
  page: MagazinDocument;
  magazinPosts: MagazinpostDocument[];
  instaIcon: InstagramIconDocument;
  decoimage: DecorationImageDocument;
};

export default function MagazineContent({
  page,
  magazinPosts,
  instaIcon,
  decoimage,
}: MagazineContentProps) {
  const filter = useFilterStore((s) => s.filter);
  const sorting = useSortingStore((s) => s.sorting);
  const [hasAppeared, setHasAppeared] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAppeared(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filters = useMemo(
    () => getUniquePostTags(magazinPosts),
    [magazinPosts],
  );

  const filteredPosts = useMemo(
    () => filterPostsByTag(sortPostsByDateDesc(magazinPosts), filter),
    [magazinPosts, filter],
  );

  const groupedPosts = useMemo(() => {
    const groups = groupPostsByMonth(filteredPosts);
    return sorting === 'neu' ? groups : [...groups].reverse();
  }, [filteredPosts, sorting]);

  const highlightedPosts = useMemo(
    () => getHighlightedPosts(magazinPosts),
    [magazinPosts],
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
                key={post.id}
                post={post}
                instaIcon={instaIcon}
                index={index}
                hasAppeared={hasAppeared}
              />
            ))}
          </div>
          <div className={styles.highlightedpostsmobile}>
            {highlightedPosts.map((post, index) => (
              <PostPreview
                post={post}
                key={post.id}
                index={index}
                instaIcon={instaIcon}
                hasAppeared={hasAppeared}
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
          hasAppeared={hasAppeared}
        />
      </div>
    </div>
  );
}
