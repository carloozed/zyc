'use client';

import React from 'react';
import {
  GalleryDocument,
  GalleryDocumentDataFilterOptionsItem,
  Simplify,
} from '@/prismicio-types';

import styles from './GalleryFilterContainer.module.css';

import FadeIn from '@/app/components/FadeIn/FadeIn';

import useGalleryFilterStore from '@/stores/GalleryFilterStore';
import useGalleryYearStore from '@/stores/GalleryYearStore';
import useGalleryMediaTypeStore from '@/stores/GalleryMediaTypeStore';

type GalleryFilterContainerProps = {
  page: GalleryDocument;
  filters: Simplify<GalleryDocumentDataFilterOptionsItem>[];
};

export default function GalleryFilterContainer({
  page,
  filters,
}: GalleryFilterContainerProps) {
  const filter = useGalleryFilterStore((state) => state.filter);
  const setFilter = useGalleryFilterStore((state) => state.setFilter);

  const setGalleryYear = useGalleryYearStore((state) => state.setGalleryYear);

  const mediaType = useGalleryMediaTypeStore((state) => state.mediaType);
  const setMediaType = useGalleryMediaTypeStore((state) => state.setMediaType);

  const isFilterVisible =
    page.data.filterbar_visible && filters.length > 1 && mediaType === 'photos';

  return (
    <FadeIn
      className={styles.filtercontainer}
      vars={{
        duration: 1.2,
        delay: 1,
      }}
    >
      <div className={styles.sortcontainer}>
        <h4>{'Edition:'}</h4>
        <select onChange={(e) => setGalleryYear(e.target.value)}>
          {page.data.sorting_options.map((item, index) => (
            <option
              key={`${index}-${item.item}`}
              value={item.selectkey as string}
            >
              {item.item}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.mediatypetabs}>
        <button
          type="button"
          onClick={() => setMediaType('photos')}
          className={`${styles.filterbutton} ${mediaType === 'photos' ? styles.active : ''}`}
        >
          Fotos
        </button>
        <button
          type="button"
          onClick={() => setMediaType('videos')}
          className={`${styles.filterbutton} ${mediaType === 'videos' ? styles.active : ''}`}
        >
          Videos
        </button>
      </div>
      {isFilterVisible && (
        <div className={styles.filterbar}>
          <h4>Filter: </h4>
          <div className={styles.filters}>
            {filters.map((item, index) => (
              <button
                key={`${index}-${item}`}
                onClick={() =>
                  setFilter(
                    item.filter_key !== filter
                      ? (item?.filter_key?.toLowerCase() as string)
                      : '',
                  )
                }
                className={`${styles.filterbutton} ${filter === item?.filter_key?.toLowerCase() ? styles.active : ''}`}
              >
                {item.item}
              </button>
            ))}
          </div>
        </div>
      )}
    </FadeIn>
  );
}
