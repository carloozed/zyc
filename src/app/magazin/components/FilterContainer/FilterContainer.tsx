'use client';

import React from 'react';
import { MagazinDocument } from '../../../../../prismicio-types';

import styles from './FilterContainer.module.css';

import FadeIn from '@/app/components/FadeIn/FadeIn';

import useFilterStore from '@/stores/FilterStore';
import useSortingStore from '@/stores/SortingStore';

type FilterContainerProps = {
  page: MagazinDocument;
};

export default function FilterContainer({ page }: FilterContainerProps) {
  const { setFilter, filter } = useFilterStore();
  const { setSortingStore } = useSortingStore();

  return (
    <FadeIn
      className={styles.filtercontainer}
      vars={{
        duration: 1.2,
        delay: 1,
      }}
    >
      <div className={styles.sortcontainer}>
        <h4>Sortieren nach:</h4>
        <select>
          {page.data.sorting_options.map((item, index) => (
            <option
              key={`${index}-${item.item}`}
              onChange={() =>
                setSortingStore(item.item?.toLowerCase() as string)
              }
            >
              {item.item}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterbar}>
        <h4>Filter: </h4>
        {page.data.filter_options.map((item, index) => (
          <button
            key={`${index}-${item.item}`}
            onClick={() =>
              setFilter(
                item.item?.toLowerCase() !== filter
                  ? (item.item?.toLowerCase() as string)
                  : ''
              )
            }
            className={`${styles.filterbutton} ${filter === item.item?.toLowerCase() ? styles.active : ''}`}
          >
            {item.item}
          </button>
        ))}
      </div>
    </FadeIn>
  );
}
