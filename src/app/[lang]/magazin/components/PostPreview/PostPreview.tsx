import React from 'react';

import styles from './PostPreview.module.css';
import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import { TransitionLink } from '@/app/components/TransitionLink/TransitionLink';
import TagsContainer from '../TagsContainer/TagsContainer';
import PostDate from '../Date/Date';
import TextContainer from '../TextContainer/TextContainer';

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
      key={index}
      vars={{
        duration: !hasAppeared ? 2 : 0,
        delay: !hasAppeared ? 1.4 + index * 0.1 : 0,
      }}
    >
      <div className={styles.uppercontainer}>
        <PostDate post={post} />
        <TagsContainer post={post} />
      </div>
      <div className={styles.contentcontainer}>
        <div className={styles.imagecontainer}>
          <PrismicNextImage field={post.data.previewe_image} />
        </div>
        <div className={styles.rightsidecontainer}>
          <TextContainer>
            <PrismicRichText field={post.data.preview_title} />
            <PrismicRichText field={post.data.preview_text} />
          </TextContainer>
          <div className={styles.linkcontainer}>
            {' '}
            {post.data.has_instagram && (
              <div className={styles.instaicon}>
                <PrismicNextLink field={post.data.instagram_link}>
                  <PrismicNextImage field={instaIcon.data.instagram_icon} />
                </PrismicNextLink>
              </div>
            )}
            {post.data.has_redirect_link && (
              <TransitionLink href={post.url ?? ''}>
                Mehr erfahren
              </TransitionLink>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
