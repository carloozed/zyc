import React from 'react';

import styles from './PostPreview.module.css';
import {
  InstagramIconDocument,
  MagazinpostDocument,
  MagazinpostDocumentDataTagsItem,
  Simplify,
} from '../../../../../prismicio-types';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import formatIsoToDate from '../../../../../helpers/formatIsoToDate';
import { isFilled } from '@prismicio/client';

type PostPreviewProps = {
  post: MagazinpostDocument;
  index: number;
  instaIcon: InstagramIconDocument;
};

export default function PostPreview({
  post,
  index,
  instaIcon,
}: PostPreviewProps) {
  return (
    <div className={styles.postpreview} key={index}>
      <div className={styles.uppercontainer}>
        <div>
          <p className={styles.date}>
            {formatIsoToDate(post.data.publishing_date as string)}
          </p>
        </div>
        <div className={styles.tagscontainer}>
          {post.data.tags.map(
            (tag: Simplify<MagazinpostDocumentDataTagsItem>, index: number) => (
              <p key={`${index}-${tag.item}`}>{tag.item}</p>
            )
          )}
        </div>
      </div>
      <div className={styles.imagecontainer}>
        <PrismicNextImage field={post.data.previewe_image} />
      </div>
      <div className={styles.textcontainer}>
        <PrismicRichText field={post.data.preview_title} />
        <PrismicRichText field={post.data.preview_text} />
      </div>
      <div className={styles.linkcontainer}>
        <PrismicNextLink field={post.data.redirect_link} />
        {isFilled && (
          <div className={styles.instaicon}>
            <PrismicNextLink field={post.data.instagram_link}>
              <PrismicNextImage field={instaIcon.data.instagram_icon} />
            </PrismicNextLink>
          </div>
        )}
      </div>
    </div>
  );
}
