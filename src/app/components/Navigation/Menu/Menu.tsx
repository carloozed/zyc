'use client';

import React, { useState, useRef } from 'react';
import styles from './Menu.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { LinkField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

import { usePathname } from 'next/navigation';

// Register the plugin
gsap.registerPlugin(SplitText, useGSAP);

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, lownavigations, setIsOpen } = menuProps;
  const [subbarIsOpen, setSubbarIsOpen] = useState(false);
  const subnavLinksRef = useRef<(HTMLSpanElement | null)[]>([]);

  const legal = lownavigations[1];
  const socials = lownavigations[0];
  const address = menuProps.address.data;
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
      default:
        return '0%';
    }
  };
  useGSAP(() => {
    if (subbarIsOpen && subnavLinksRef.current.length > 0) {
      // Reset the array if needed
      subnavLinksRef.current = subnavLinksRef.current.slice(
        0,
        subnavigation.subnavigation_items.length
      );

      // Apply SplitText to each link
      subnavLinksRef.current.forEach((link) => {
        if (link) {
          // Create a SplitText instance
          const splitText = new SplitText(link, {
            type: 'chars',
            charsClass: 'char',
          });

          // Animate the characters
          gsap.fromTo(
            splitText.chars,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.4,
              ease: 'power2.out',
            }
          );
        }
      });
    }
  }, [subbarIsOpen]);

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
                      <PrismicNextLink field={item.item} />
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
                                >
                                  <span>[0{index + 1}] </span>
                                  <span
                                    ref={(el) => {
                                      subnavLinksRef.current[index] = el;
                                    }}
                                  >
                                    <PrismicNextLink field={item.link} />
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
