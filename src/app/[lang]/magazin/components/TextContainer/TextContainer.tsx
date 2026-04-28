import React from 'react';

import styles from './TextContainer.module.css';

type TextContainerProps = {
  children: React.ReactNode;
};

export default function TextContainer({ children }: TextContainerProps) {
  return <div className={styles.textcontainer}>{children}</div>;
}
