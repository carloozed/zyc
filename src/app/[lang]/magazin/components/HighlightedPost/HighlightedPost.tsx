import React from 'react';

import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';

type HighlightedPostProps = {
  post: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
};

import styles from './HighlightedPost.module.css';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { TransitionLink } from '@/app/components/TransitionLink/TransitionLink';
import TagsContainer from '../TagsContainer/TagsContainer';
import PostDate from '../Date/Date';

export default function HighlightedPost({
  post,
  instaIcon,
}: HighlightedPostProps) {
  return (
    <div className={styles.highlightcontainer}>
      <div className={styles.uppercontainer}>
        <PostDate post={post} />
        <TagsContainer post={post} />
      </div>
      <PrismicRichText field={post.data.preview_title} />
      <PrismicNextImage field={post.data.previewe_image} />
      <PrismicRichText field={post.data.preview_text} />
      {post.data.has_instagram && (
        <div className={styles.instaicon}>
          <PrismicNextLink field={post.data.instagram_link}>
            <PrismicNextImage field={instaIcon.data.instagram_icon} />
          </PrismicNextLink>
        </div>
      )}
      {post.data.has_redirect_link && (
        <TransitionLink href={post.url ?? ''}>Mehr erfahren</TransitionLink>
      )}
    </div>
  );
}
