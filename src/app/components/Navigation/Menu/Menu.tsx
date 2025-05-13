import React from 'react';

import styles from './Menu.module.css';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

import { LinkField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, lownavigations } = menuProps;

  const legal = lownavigations[1];
  const socials = lownavigations[0];
  const address = menuProps.address.data;
  const logo = menuProps.logo.data;
  console.log(legal);

  return (
    <>
      {isOpen && (
        <div className={styles.menu__container}>
          <div className={styles.menu__leftcontainer}>
            <div className={styles.menu__navlistcontainer}>
              <ul className={styles.menu__navlist}>
                {navbar.data.navigation_items.map(
                  (item: { item: LinkField }, index: number) => (
                    <li key={index} className={styles.navbar__item}>
                      <PrismicNextLink field={item.item} />
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
