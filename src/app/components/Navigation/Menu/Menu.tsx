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

import { useMobile } from '@/contexts/MobileContext';

import NewsletterLink from '../../NewsletterLink/NewsletterLink';

// Register the plugin
gsap.registerPlugin(SplitText, useGSAP);

export default function Menu({ ...menuProps }) {
  const { navbar, isOpen, setIsOpen, lowNavigation, termineIsVisible } =
    menuProps;
  const [subbarIsOpen, setSubbarIsOpen] = useState(false);

  const { isMobile } = useMobile();
  const subnavLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const linkContainerRef = useRef<(HTMLDivElement | null)[]>([]);
  const legalLinkContainerRef = useRef<(HTMLLIElement | null)[]>([]);
  const lowerContainerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  // const legal = lownavigations[1];
  // const socials = lownavigations[0];

  const logo = menuProps.logo.data;
  const indicator = menuProps.indicator.data;
  const subnavigation = menuProps.subnavigation.data;

  console.log(termineIsVisible.data);

  const pathname = usePathname();

  const indicatorPosition = () => {
    switch (pathname) {
      case '/':
        return '0%';
      case '/the_contest':
        return '110%';
      case '/the_cadenza':
        return '110%';
      case '/the_crescendo':
        return '110%';
      case '/ueber_zyc':
        return '210%';
      case '/termine':
        return '310%';
      default:
        return '0%';
    }
  };

  useGSAP(() => {
    if (isOpen) {
      gsap.set(linkContainerRef.current, { y: !isMobile ? '140%' : '140%' });
      gsap.to(linkContainerRef.current, {
        y: '10%',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 1,
      });
    }

    if (isOpen) {
      gsap.set(subnavLinksRef.current, { y: '140%' });
      gsap.to(subnavLinksRef.current, {
        y: '10%',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 1.5,
      });
    }

    if (isOpen) {
      gsap.set(indicatorRef.current, {
        opacity: 0,
        y: !isMobile ? '120%' : '140%',
      });
      gsap.to(indicatorRef.current, {
        y: '0%',
        opacity: 1,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 1.8,
      });
    }

    if (isOpen) {
      gsap.set(lowerContainerRef.current, { opacity: 0, y: '140%' });
      gsap.to(lowerContainerRef.current, {
        y: '0%',
        opacity: 1,
        duration: 2,
        ease: 'power3.out',
        delay: 2,
      });
    }

    if (isOpen) {
      gsap.set(legalLinkContainerRef.current, { y: '140%' });
      gsap.to(legalLinkContainerRef.current, {
        y: '0%',
        stagger: 0.4,
        duration: 2,
        ease: 'power3.out',
        delay: 2,
      });
    }
  }, [isOpen]);

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
                  <div ref={indicatorRef}>
                    <PrismicNextImage field={indicator.image} />
                  </div>
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
                      <div className={styles.overlflow__container}>
                        <div
                          className={styles.navbar__linkcontainer}
                          ref={(el) => {
                            if (!linkContainerRef.current) {
                              linkContainerRef.current = [];
                            }
                            linkContainerRef.current[index] = el;
                          }}
                        >
                          {termineIsVisible.data.termine_is_visible === false &&
                          item.item.text == 'Termine' ? (
                            <h2
                              className={`${
                                termineIsVisible.data.termine_is_visible ===
                                  false && styles.termine_not_visible
                              }`}
                            >
                              {item.item.text}
                            </h2>
                          ) : (
                            <TransitionLink field={item.item} />
                          )}
                        </div>
                      </div>
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
                                  onClick={() => setSubbarIsOpen(false)}
                                >
                                  <div
                                    ref={(el) => {
                                      subnavLinksRef.current[index] = el;
                                    }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <span>
                                      <TransitionLink field={item.link} />
                                    </span>
                                  </div>
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
              <ul
                className={styles.menu__navlist}
                style={{ overflow: 'hidden' }}
              >
                {lowNavigation.data.low_navigation_items.map(
                  (item: { item: LinkField }, index: number) => (
                    <li
                      key={index}
                      className={styles.lowernavbar__item}
                      onClick={() => setIsOpen(false)}
                      ref={(el) => {
                        if (!legalLinkContainerRef.current) {
                          legalLinkContainerRef.current = [];
                        }
                        legalLinkContainerRef.current[index] = el;
                      }}
                    >
                      {item.item.text !== 'Newsletter' ? (
                        <>
                          <TransitionLink field={item.item} />
                          {index !==
                            lowNavigation.data.low_navigation_items.length -
                              1 && <div></div>}
                        </>
                      ) : (
                        <NewsletterLink />
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className={styles.menu__rightcontainer}>
            <div className={styles.menu__wrapper} ref={lowerContainerRef}>
              <div className={styles.menu__logocontainer}>
                <PrismicNextImage field={logo.image} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
