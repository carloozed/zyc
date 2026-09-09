'use client';

import { useEffect } from 'react';
import styles from './NewsletterForm.module.css';
import { NewsletterFormDocument } from '@/prismicio-types';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import useNewsletterStore from '@/stores/NewsletterStore';
import NewsletterSignup from './NewsletterSignup';

export type NewsletterProps = {
  newsletter: NewsletterFormDocument;
};

/** The newsletter signup as a fixed overlay, opened from the menu and footer
 * links through `NewsletterStore`. The same form lives inline on /newsletter. */
export default function FormContent({ newsletter }: NewsletterProps) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewsletterFormShown) {
        setNewsletterFormShown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNewsletterFormShown, setNewsletterFormShown]);

  return (
    <div
      className={`${styles.formcontainer} ${isNewsletterFormShown ? styles.formcontainer__shown : ''}`}
    >
      <div className={styles.card}>
        <div
          className={styles.cross__container}
          onClick={() => setNewsletterFormShown(false)}
        >
          <div className={styles.cross}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={styles.image}>
          <PrismicNextImage field={newsletter.data.newsletter_image} />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <PrismicRichText field={newsletter.data.newsletter_title} />
            <PrismicRichText field={newsletter.data.newsletter_text} />
          </div>
          <NewsletterSignup
            newsletter={newsletter}
            onSuccess={() => {
              setTimeout(() => setNewsletterFormShown(false), 1000);
            }}
          />
        </div>
      </div>
    </div>
  );
}
