import React from 'react';

import styles from './PostPreview.module.css';
import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import TagsContainer from '../TagsContainer/TagsContainer';
import PostDate from '../Date/Date';
import TextContainer from '../TextContainer/TextContainer';
import DateTagsContainer from '../DateTagsContainer/DateTagsContainer';
import LinkContainer from '../LinkContainer/LinkContainer';

type PostPreviewProps = {
  post: MagazinpostDocument;
  index: number;
  instaIcon: InstagramIconDocument;
  hasAppeared: boolean;
};

export default function PostPreview({
  post,
  index,
  instaIcon,
  hasAppeared,
}: PostPreviewProps) {
  return (
    <FadeIn
      className={styles.postpreview}
      vars={{
        duration: !hasAppeared ? 2 : 0,
        delay: !hasAppeared ? 1.4 + index * 0.1 : 0,
      }}
    >
      <DateTagsContainer>
        <PostDate post={post} />
        <TagsContainer post={post} />
      </DateTagsContainer>
      <div className={styles.contentcontainer}>
        <div className={styles.imagecontainer}>
          <PrismicNextImage field={post.data.previewe_image} />
        </div>
        <div className={styles.rightsidecontainer}>
          <TextContainer>
            <PrismicRichText field={post.data.preview_title} />
            <PrismicRichText field={post.data.preview_text} />
          </TextContainer>
          <LinkContainer post={post} instaIcon={instaIcon} />
        </div>
      </div>
    </FadeIn>
  );
}
