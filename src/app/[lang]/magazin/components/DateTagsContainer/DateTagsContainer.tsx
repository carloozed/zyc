import React from 'react';

type Props = {
  children: React.ReactNode;
};

import styles from './DateTagsContainer.module.css';

export default function DateTagsContainer({ children }: Props) {
  return <div className={styles.uppercontainer}>{children}</div>;
}
