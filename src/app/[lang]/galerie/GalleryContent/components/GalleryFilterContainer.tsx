'use client';

import React from 'react';
import { GalleryDocument } from '@/prismicio-types';

import styles from './GalleryFilterContainer.module.css';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import SortingSelect from '@/app/components/SortingSelect/SortingSelect';

import useGalleryStore, { GalleryMediaType } from '@/stores/GalleryStore';

type GalleryFilterContainerProps = {
  page: GalleryDocument;
};

const MEDIA_TYPE_TABS: { mediaType: GalleryMediaType; label: string }[] = [
  { mediaType: 'photos', label: 'Fotos' },
  { mediaType: 'videos', label: 'Videos' },
];

export default function GalleryFilterContainer({
  page,
}: GalleryFilterContainerProps) {
  const filter = useGalleryStore((state) => state.filter);
  const setFilter = useGalleryStore((state) => state.setFilter);
  const setGalleryYear = useGalleryStore((state) => state.setGalleryYear);
  const mediaType = useGalleryStore((state) => state.mediaType);
  const setMediaType = useGalleryStore((state) => state.setMediaType);

  const filterOptions = page.data.filter_options;
  const isFilterVisible =
    page.data.filterbar_visible &&
    filterOptions.length > 1 &&
    mediaType === 'photos';

  return (
    <FadeIn
      className={styles.filtercontainer}
      vars={{
        duration: 1.2,
        delay: 1,
      }}
    >
      <SortingSelect
        className={styles.sortcontainer}
        label="Edition:"
        items={page.data.sorting_options}
        onChange={(e) => setGalleryYear(e.target.value)}
      />
      <div className={styles.mediatypetabs}>
        {MEDIA_TYPE_TABS.map((tab) => (
          <button
            key={tab.mediaType}
            type="button"
            onClick={() => setMediaType(tab.mediaType)}
            className={`${styles.filterbutton} ${mediaType === tab.mediaType ? styles.active : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isFilterVisible && (
        <div className={styles.filterbar}>
          <h4>Filter: </h4>
          <div className={styles.filters}>
            {filterOptions.map((item, index) => {
              const filterKey = item.filter_key?.toLowerCase() ?? '';
              return (
                <button
                  key={`${index}-${item.item}`}
                  type="button"
                  onClick={() => setFilter(filterKey === filter ? '' : filterKey)}
                  className={`${styles.filterbutton} ${filter === filterKey ? styles.active : ''}`}
                >
                  {item.item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </FadeIn>
  );
}
