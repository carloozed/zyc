import React from 'react';
import { MagazinDocument } from '../../../../../prismicio-types';

import styles from './FilterContainer.module.css';

type FilterContainerProps = {
  page: MagazinDocument;
};

export default function FilterContainer({ page }: FilterContainerProps) {
  return (
    <div className={styles.filtercontainer}>
      <div className={styles.sortcontainer}>
        <h4>Sortieren nach:</h4>
        <select>
          {page.data.sorting_options.map((item, index) => (
            <option key={`${index}-${item.item}`}>{item.item}</option>
          ))}
        </select>
      </div>
      <div className={styles.filterbar}>
        <h4>Filter: </h4>
        {page.data.filter_options.map((item, index) => (
          <button key={`${index}-${item.item}`}>{item.item}</button>
        ))}
      </div>
    </div>
  );
}
