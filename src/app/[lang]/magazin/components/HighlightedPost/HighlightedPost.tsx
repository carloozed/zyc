import React from 'react';

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
  index: number;
  hasAppeared: boolean;
};

export default function HighlightedPost({
  post,
  instaIcon,
  index,
  hasAppeared,
}: HighlightedPostProps) {
  return (
    <FadeIn
      className={styles.highlightcontainer}
      vars={{
        duration: !hasAppeared ? 2 : 0,
        delay: !hasAppeared ? 1.4 + index * 0.1 : 0,
      }}
    >
      <>
        {post.tags.some((tag) => tag === 'wide') ? (
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
        ) : (
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
        )}
      </>
    </FadeIn>
  );
}
