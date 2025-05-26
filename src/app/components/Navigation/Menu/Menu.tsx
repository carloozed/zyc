'use client';

import React, { useState, useRef } from 'react';
import styles from './Menu.module.css';
import { PrismicNextImage } from '@prismicio/next';
import { LinkField } from '@prismicio/client';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

import { usePathname } from 'next/navigation';
import { TransitionLink } from '../../TransitionLink/TransitionLink';

// Register the plugin
gsap.registerPlugin(SplitText, useGSAP);

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, lownavigations, setIsOpen } = menuProps;
  const [subbarIsOpen, setSubbarIsOpen] = useState(false);
  const subnavLinksRef = useRef<(HTMLSpanElement | null)[]>([]);

  const legal = lownavigations[1];
  const socials = lownavigations[0];

  const logo = menuProps.logo.data;
  const indicator = menuProps.indicator.data;
  const subnavigation = menuProps.subnavigation.data;

  const pathname = usePathname();

  const indicatorPosition = () => {
    switch (pathname) {
      case '/':
        return '0%';
      case '/the_contest':
        return '100%';
      case '/the_cadenza':
        return '100%';
      case '/the_crescendo':
        return '100%';
      case '/termine':
        return '200%';
      case '/ueber_zyc':
        return '300%';
      default:
        return '0%';
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.menu__container}>
          <div className={styles.menu__leftcontainer}>
            <div className={styles.menu__navlistcontainer}>
              <ul className={styles.menu__navlist}>
                <div
                  className={styles.menu__navlist__indicator}
                  style={{
                    transform: `translateY(${indicatorPosition()})  translateX(-120%)`,
                  }}
                >
                  <PrismicNextImage field={indicator.image} />
                </div>
                {navbar.data.navigation_items.map(
                  (item: { item: LinkField }, index: number) => (
                    <li
                      key={index}
                      className={styles.navbar__item}
                      onMouseEnter={() => setSubbarIsOpen(index === 1)}
                      onMouseLeave={() => setSubbarIsOpen(false)}
                      onClick={() => setIsOpen(false)}
                    >
                      <TransitionLink field={item.item} />
                      <div className={styles.subnavbar__container}>
                        <ul
                          className={`${styles.subnavbar__subnavbar} ${subbarIsOpen ? styles.subnavbar__open : ''}`}
                        >
                          {index === 1 &&
                            subnavigation.subnavigation_items.map(
                              (item: { link: LinkField }, index: number) => (
                                <li
                                  key={index}
                                  className={styles.subnavbar__item}
                                  ref={(el) => {
                                    subnavLinksRef.current[index] = el;
                                  }}
                                >
                                  <span>[0{index + 1}] </span>
                                  <span>
                                    <TransitionLink field={item.link} />
                                  </span>
                                </li>
                              )
                            )}
                        </ul>
                      </div>
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
                      <TransitionLink field={item.item} />{' '}
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
                </div>
              </div>
              <div className={styles.menu__socialscontainer}>
                <ul className={styles.menu__navlist}>
                  {socials.data.low_navigation_items.map(
                    (item: { item: LinkField }, index: number) => (
                      <li key={index} className={styles.lowernavbar__item}>
                        <TransitionLink field={item.item} />
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
