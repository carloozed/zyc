import React from 'react';
import styles from './GraphicalArrow.module.css';

export default function GraphicalArrow() {
  return (
    <div className={styles.wrapper}>
      {' '}
      <svg
        width={219}
        height={9}
        viewBox="0 0 219 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M218.559 4.05029L211.519 -0.000143979L211.536 8.11883L218.559 4.05029ZM0.00195312 4.33154L0.00342635 5.03467L212.232 4.76156L212.231 4.05844L212.229 3.35531L0.000479899 3.62842L0.00195312 4.33154Z"
          fill="black"
        />
      </svg>
    </div>
  );
}
