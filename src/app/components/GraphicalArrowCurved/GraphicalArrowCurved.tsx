import React from 'react';
import styles from './GraphicalArrowCurved.module.css';

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
          d="M295.261 11.0027L286.535 12.3277L287.346 6.3897L295.261 11.0027ZM0.766313 91.2222L-0.000805714 90.9035C27.3094 54.8222 63.4778 27.5085 110.736 12.6356C158.009 -2.24211 216.319 -4.65181 287.813 9.00307L287.752 9.51899L287.69 10.0349C216.556 -3.55119 158.645 -1.1403 111.719 13.6283C64.7773 28.4017 28.7675 55.5601 1.53343 91.5408L0.766313 91.2222Z"
          fill="black"
        />
      </svg>
    </div>
  );
}
