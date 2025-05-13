import React from 'react';

import styles from './Menu.module.css';

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, setIsOpen } = menuProps;
  return (
    <>
      {isOpen && (
        <div className={styles.menu__container}>
          <h1>Menu</h1>
        </div>
      )}
    </>
  );
}
