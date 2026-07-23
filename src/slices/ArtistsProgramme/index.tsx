import { FC } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

import styles from './index.module.css';

export type ArtistsProgrammeProps =
  SliceComponentProps<Content.ArtistsProgrammeSlice>;

const ArtistsProgramme: FC<ArtistsProgrammeProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.wrapper}
    >
      <div className={styles.title}>
        <PrismicRichText field={slice.primary.title} />
      </div>

      <ul className={styles.categories}>
        {slice.primary.categories.map((category, index) => (
          <li
            key={category.id || index}
            id={category.id || undefined}
            className={styles.category}
          >
            <PrismicRichText field={category.title} />
          </li>
        ))}
      </ul>

      <div className={styles.descriptions}>
        {slice.primary.descriptions.map((item, index) => (
          <div
            key={item.id || index}
            id={item.id || undefined}
            className={styles.description}
          >
            <PrismicRichText field={item.title} />
            <PrismicRichText field={item.description} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistsProgramme;
