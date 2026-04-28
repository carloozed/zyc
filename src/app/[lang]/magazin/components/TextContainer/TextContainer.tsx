import React from 'react';

import styles from './TextContainer.module.css';

type TextContainerProps = {
  children: React.ReactNode;
  variant?: 'highlight' | 'preview';
};

export default function TextContainer({
  children,
  variant = 'preview',
}: TextContainerProps) {
  return <div className={styles[variant]}>{children}</div>;
}
