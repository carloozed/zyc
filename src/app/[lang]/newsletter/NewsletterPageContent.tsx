import { PrismicRichText } from '@prismicio/react';

import { NewsletterFormDocument } from '@/prismicio-types';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import { RevealText } from '@/app/components/RevealText/RevealText';
import NewsletterSignup from '@/app/components/NewsletterForm/NewsletterSignup';

import styles from './NewsletterPageContent.module.css';

type Props = {
  newsletter: NewsletterFormDocument;
};

export default function NewsletterPageContent({ newsletter }: Props) {
  return (
    <main className={`page-container ${styles.main}`}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <RevealText
            field={newsletter.data.newsletter_title}
            as="h1"
            staggerAmount={0.08}
            duration={1.4}
          />
        </div>
        <FadeIn className={styles.body} vars={{ delay: 0.5, duration: 1.4 }}>
          <PrismicRichText field={newsletter.data.newsletter_text} />
          <NewsletterSignup newsletter={newsletter} />
        </FadeIn>
      </div>
    </main>
  );
}
