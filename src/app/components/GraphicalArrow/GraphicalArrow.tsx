import React from 'react';
import styles from './GraphicalArrow.module.css';

/* .draw is a stroked path so DrawSVG can draw it; .head keeps the original
   filled triangle and is scaled in from the line's tip by the animation. */
export default function GraphicalArrow() {
  return (
    <div className={styles.wrapper}>
      <svg
        width={219}
        height={9}
        viewBox="0 0 219 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path className="draw" d="M0 4.05H212.23" stroke="black" strokeWidth={1.4} />
        <path
          className="head"
          d="M218.559 4.05029L211.519 -0.000143979L211.536 8.11883L218.559 4.05029Z"
          fill="black"
        />
      </svg>
    </div>
  );
}
