import React from 'react';

import styles from './MagazineContent.module.css';
import {
  DecorationImageDocument,
  InstagramIconDocument,
  MagazinDocument,
  MagazinpostDocument,
} from '../../../../prismicio-types';
import BlogContainer from './BlogContainer/BlogContainer';
import FilterContainer from './FilterContainer/FilterContainer';
import { RevealText } from '@/app/components/RevealText/RevealText';
import FadeIn from '@/app/components/FadeIn/FadeIn';

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
  const postLength = magazinPosts.length.toString();

  const filters = [
    ...new Set(
      magazinPosts.flatMap((post) => post.data.tags.map((tag) => tag.item)),
    ),
  ];

  console.log(filters);

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
            <h5>({postLength})</h5>
          </FadeIn>
        </div>
      </div>
      <div className={styles.lowercontainer}>
        <div className={styles.filter}>
          <FilterContainer page={page} filters={filters} />
        </div>
        <BlogContainer
          magazinPosts={magazinPosts}
          instaIcon={instaIcon}
          decoimage={decoimage}
        />
      </div>
    </div>
  );
}
