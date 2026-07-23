import React from 'react';
import styles from './GraphicalArrowCurved.module.css';

/* .draw is a stroked path (runs bottom-left → top-right so DrawSVG draws it
   toward the head); .head keeps the original filled triangle and is scaled
   in from the curve's tip by the animation. */
export default function GraphicalArrowCurved() {
  return (
    <div className={styles.wrapper}>
      <svg
        width={296}
        height={92}
        viewBox="0 0 296 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="draw"
          d="M0.77 91.22C27.79 55.19 63.98 28.07 111.23 13.13C158.33 -1.69 216.44 -4.1 287.75 9.52"
          stroke="black"
          strokeWidth={1.1}
        />
        <path
          className="head"
          d="M295.261 11.0027L286.535 12.3277L287.346 6.3897L295.261 11.0027Z"
          fill="black"
        />
      </svg>
    </div>
  );
}
