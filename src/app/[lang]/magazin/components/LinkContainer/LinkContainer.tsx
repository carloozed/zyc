import { TransitionLink } from '@/app/components/TransitionLink/TransitionLink';
import { InstagramIconDocument, MagazinpostDocument } from '@/prismicio-types';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import React from 'react';

import styles from './LinkContainer.module.css';

type Props = {
  post: MagazinpostDocument;
  instaIcon: InstagramIconDocument;
};

export default function LinkContainer({ post, instaIcon }: Props) {
  return (
    <div className={styles.linkcontainer}>
      <div className={styles.instaicon}>
        {post.data.has_instagram && (
          <PrismicNextLink field={post.data.instagram_link}>
            <PrismicNextImage field={instaIcon.data.instagram_icon} />
          </PrismicNextLink>
        )}{' '}
      </div>
      <div className={styles.redirectlink}>
        {post.data.has_redirect_link && (
          <TransitionLink href={post.url ?? ''}>Mehr erfahren</TransitionLink>
        )}
      </div>
    </div>
  );
}
