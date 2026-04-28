import React from 'react';

import styles from './StickyContainer.module.css';

type StickyContainerProps = { children: React.ReactNode };

export default function StickyContainer({ children }: StickyContainerProps) {
  return <div className={styles.sticky}>{children}</div>;
}
