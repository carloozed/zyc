'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { GalleryDocument } from '@/prismicio-types';

import styles from './GalleryFilterContainer.module.css';

import FadeIn from '@/app/components/FadeIn/FadeIn';
import GalleryMediaTabs from './GalleryMediaTabs';

import useGalleryStore from '@/stores/GalleryStore';
import { GALLERY_VIEW_PARAM, mediaTypeFromParam } from '@/helpers/gallery';

type GalleryFilterContainerProps = {
  page: GalleryDocument;
};

export default function GalleryFilterContainer({
  page,
}: GalleryFilterContainerProps) {
  const filter = useGalleryStore((state) => state.filter);
  const setFilter = useGalleryStore((state) => state.setFilter);
  const setGalleryYear = useGalleryStore((state) => state.setGalleryYear);
  const mediaType = mediaTypeFromParam(
    useSearchParams().get(GALLERY_VIEW_PARAM),
  );

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
      {/* Tabs and edition share a row so the sticky bar stays as tall as
          before, also on mobile where the bar stacks its rows. */}
      <div className={styles.viewrow}>
        <GalleryMediaTabs lang={page.lang} />
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
                  onClick={() =>
                    setFilter(filterKey === filter ? '' : filterKey)
                  }
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
