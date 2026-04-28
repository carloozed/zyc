import React, { useEffect, useState } from 'react';

import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';

import styles from './HighlightedPost.module.css';
import { PrismicRichText } from '@prismicio/react';
import TagsContainer from '../TagsContainer/TagsContainer';
import PostDate from '../Date/Date';
import TextContainer from '../TextContainer/TextContainer';
import DateTagsContainer from '../DateTagsContainer/DateTagsContainer';
import LinkContainer from '../LinkContainer/LinkContainer';
import { PrismicNextImage } from '@prismicio/next';
import FadeIn from '@/app/components/FadeIn/FadeIn';

type HighlightedPostProps = {
  post: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
  variant: 'wide' | 'narrow';
  index: number;
};

export default function HighlightedPost({
  post,
  instaIcon,
  variant,
  index,
}: HighlightedPostProps) {
  const [hasAppeared, setHasAppeared] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAppeared(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FadeIn
      className={styles.highlightcontainer}
      vars={{
        duration: !hasAppeared ? 2 : 0,
        delay: !hasAppeared ? 1.4 + index * 0.1 : 0,
      }}
    >
      <>
        {variant === 'wide' ? (
          <div
            className={styles.contentcontainer}
            style={{ backgroundImage: `url(${post.data.previewe_image.url})` }}
          >
            <div className={styles.content}>
              <DateTagsContainer>
                <PostDate post={post} />
                <TagsContainer post={post} />
              </DateTagsContainer>
              <TextContainer variant="highlight">
                <PrismicRichText field={post.data.preview_title} />
                <PrismicRichText field={post.data.preview_text} />
              </TextContainer>
              <LinkContainer post={post} instaIcon={instaIcon} />
            </div>
          </div>
        ) : variant === 'narrow' ? (
          <div className={styles.narrowcontentcontainer}>
            <div className={styles.imagecontainer}>
              <PrismicNextImage field={post.data.previewe_image} />
            </div>
            <div className={styles.narrowcontent}>
              <DateTagsContainer>
                <PostDate post={post} />
                <TagsContainer post={post} />
              </DateTagsContainer>
              <TextContainer variant="highlight">
                <PrismicRichText field={post.data.preview_title} />
                <PrismicRichText field={post.data.preview_text} />
              </TextContainer>
              <LinkContainer post={post} instaIcon={instaIcon} />
            </div>
          </div>
        ) : null}
      </>
    </FadeIn>
  );
}
