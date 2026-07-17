'use client';

import { Content, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

import styles from './GallerySectionHeader.module.css';
import FadeIn from '@/app/components/FadeIn/FadeIn';

type GallerySectionHeaderProps = {
  editionYear: RichTextField;
  decoimage: Content.DecorationImageDocument;
  hasAnimated: boolean;
};

export default function GallerySectionHeader({
  editionYear,
  decoimage,
  hasAnimated,
}: GallerySectionHeaderProps) {
  return (
    <div className={styles.header}>
      <FadeIn
        className={styles.title}
        vars={{
          delay: hasAnimated ? 0 : 1.2,
          duration: hasAnimated ? 0 : 1.3,
        }}
      >
        <PrismicRichText field={editionYear} />
      </FadeIn>
      <FadeIn
        className={styles.imagecontainer}
        vars={{
          delay: hasAnimated ? 0 : 1.6,
          duration: hasAnimated ? 0 : 1.6,
        }}
      >
        <PrismicNextImage field={decoimage.data.image} />
      </FadeIn>
    </div>
  );
}
