'use client';

import React, { useState } from 'react';

import styles from './Menu.module.css';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

import { LinkField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, lownavigations } = menuProps;
  const [subbarIsOpen, setSubbarIsOpen] = useState(false);

  const legal = lownavigations[1];
  const socials = lownavigations[0];
  const address = menuProps.address.data;
  const logo = menuProps.logo.data;
  const indicator = menuProps.indicator.data;
  const subnavigation = menuProps.subnavigation.data;

  return (
    <>
      {isOpen && (
        <div className={styles.menu__container}>
          <div className={styles.menu__leftcontainer}>
            <div className={styles.menu__navlistcontainer}>
              <ul className={styles.menu__navlist}>
                <div className={styles.menu__navlist__indicator}>
                  <PrismicNextImage field={indicator.image} />
                </div>
                {navbar.data.navigation_items.map(
                  (item: { item: LinkField }, index: number) => (
                    <li
                      key={index}
                      className={styles.navbar__item}
                      onMouseEnter={() => setSubbarIsOpen(index === 1)}
                      onMouseLeave={() => setSubbarIsOpen(false)}
                    >
                      <PrismicNextLink field={item.item} />
                      <ul
                        className={`${styles.subnavbar__subnavbar} ${subbarIsOpen ? styles.subnavbar__open : ''}`}
                      >
                        {index === 1 &&
                          subnavigation.subnavigation_items.map(
                            (item: { link: LinkField }, index: number) => (
                              <li
                                key={index}
                                className={styles.subnavbar__item}
                              >
                                <span>[0{index + 1}] </span>
                                <PrismicNextLink field={item.link} />
                              </li>
                            )
                          )}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className={styles.menu__legalcontainer}>
              <ul className={styles.menu__navlist}>
                {legal.data.low_navigation_items.map(
                  (item: { item: LinkField }, index: number) => (
                    <li key={index} className={styles.lowernavbar__item}>
                      <PrismicNextLink field={item.item} />{' '}
                      {index !==
                        socials.data.low_navigation_items.length - 1 && (
                        <span></span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className={styles.menu__rightcontainer}>
            <div className={styles.menu__wrapper}>
              <div className={styles.menu__addresscontainer}>
                <div>
                  <div className={styles.menu__logocontainer}>
                    <PrismicNextImage field={logo.image} />
                  </div>
                  <PrismicRichText field={address.name_full} />
                </div>
                <PrismicNextLink field={address.location_link}>
                  <PrismicRichText field={address.street} />
                  <PrismicRichText field={address.city} />
                </PrismicNextLink>
              </div>
              <div className={styles.menu__socialscontainer}>
                <ul className={styles.menu__navlist}>
                  {socials.data.low_navigation_items.map(
                    (item: { item: LinkField }, index: number) => (
                      <li key={index} className={styles.lowernavbar__item}>
                        <PrismicNextLink field={item.item} />
                        {index !==
                          socials.data.low_navigation_items.length - 1 && (
                          <span></span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
