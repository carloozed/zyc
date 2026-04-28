import React from 'react';

import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';

type HighlightedPostProps = {
  post: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
  variant: 'wide' | 'narrow';
};

import styles from './HighlightedPost.module.css';
import { PrismicRichText } from '@prismicio/react';
import TagsContainer from '../TagsContainer/TagsContainer';
import PostDate from '../Date/Date';
import TextContainer from '../TextContainer/TextContainer';
import DateTagsContainer from '../DateTagsContainer/DateTagsContainer';
import LinkContainer from '../LinkContainer/LinkContainer';

export default function HighlightedPost({
  post,
  instaIcon,
  variant,
}: HighlightedPostProps) {
  return (
    <div className={styles.highlightcontainer}>
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
              <TextContainer>
                <PrismicRichText field={post.data.preview_title} />
                <PrismicRichText field={post.data.preview_text} />
              </TextContainer>
              <LinkContainer post={post} instaIcon={instaIcon} />
            </div>
          </div>
        ) : variant === 'narrow' ? (
          <div
            className={styles.contentcontainer}
            style={{ backgroundImage: `url(${post.data.previewe_image.url})` }}
          >
            <div className={styles.content}>
              <DateTagsContainer>
                <PostDate post={post} />
                <TagsContainer post={post} />
              </DateTagsContainer>
              <TextContainer>
                <PrismicRichText field={post.data.preview_title} />
                <PrismicRichText field={post.data.preview_text} />
              </TextContainer>
              <LinkContainer post={post} instaIcon={instaIcon} />
            </div>
          </div>
        ) : null}
      </>
    </div>
  );
}
