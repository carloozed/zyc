'use client';

import React, { useState, useRef } from 'react';
import styles from './Menu.module.css';
import { PrismicNextImage } from '@prismicio/next';
import { asLink, LinkField } from '@prismicio/client';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

import { usePathname } from 'next/navigation';
import { TransitionLink } from '../../TransitionLink/TransitionLink';
import stripLocale from '@/helpers/stripLocale';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';
import {
  GALLERY_MEDIA_LABELS,
  GALLERY_MEDIA_TYPES,
  galleryViewPath,
} from '@/helpers/gallery';

import { useMobile } from '@/contexts/MobileContext';

import NewsletterLink from '../../NewsletterLink/NewsletterLink';
import ContactLink from '../../ContactLink/ContactLink';

// Register the plugin
gsap.registerPlugin(SplitText, useGSAP);

// A sub-item is either a Prismic link (the Contest subnavigation document)
// or a link built in code (the gallery views).
type SubnavLink =
  | { field: LinkField; href?: never; label?: never }
  | { field?: never; href: string; label: string };

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

  const logo = menuProps.logo.data;
  const indicator = menuProps.indicator.data;
  const subnavigation = menuProps.subnavigation.data;

  const pathname = usePathname();
  const locale = useLocaleFromPathname();
  const isOnGallery = stripLocale(pathname) === '/galerie';

  // The 2nd navbar item carries the Contest subnavigation from Prismic; the
  // Galerie item, found by its URL so its position can change, gets one link
  // per gallery view.
  const subnavLinksFor = (item: LinkField, index: number): SubnavLink[] => {
    if (index === 1) {
      return subnavigation.subnavigation_items.map(
        ({ link }: { link: LinkField }) => ({ field: link }),
      );
    }
    if (stripLocale(asLink(item) ?? '') === '/galerie') {
      return GALLERY_MEDIA_TYPES.map((mediaType) => ({
        href: galleryViewPath(locale, mediaType),
        label: GALLERY_MEDIA_LABELS[mediaType][locale],
      }));
    }
    return [];
  };

  const indicatorPosition = () => {
    switch (stripLocale(pathname)) {
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
      case '/magazin':
        return '310%';
      case '/galerie':
        return '410%';
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
      // Sparse: refs are keyed per navbar item, see the subnav render below.
      const subnavLinks = subnavLinksRef.current.filter(Boolean);
      gsap.set(subnavLinks, { y: '140%' });
      gsap.to(subnavLinks, {
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
                          {subnavLinksFor(item.item, index).map(
                            (subnavLink, subIndex) => (
                              <li
                                key={subIndex}
                                className={styles.subnavbar__item}
                                onClick={() => setSubbarIsOpen(false)}
                              >
                                <div
                                  ref={(el) => {
                                    subnavLinksRef.current[
                                      index * 10 + subIndex
                                    ] = el;
                                  }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <span>
                                    {subnavLink.field ? (
                                      <TransitionLink
                                        field={subnavLink.field}
                                      />
                                    ) : (
                                      // On the gallery already: replace, so
                                      // back doesn't step between two query
                                      // strings (see GalleryMediaTabs).
                                      <TransitionLink
                                        href={subnavLink.href}
                                        replace={isOnGallery}
                                      >
                                        {subnavLink.label}
                                      </TransitionLink>
                                    )}
                                  </span>
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </li>
                  ),
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
                      {item.item.text === 'Newsletter' ? (
                        <NewsletterLink />
                      ) : item.item.text === 'Kontakt' ? (
                        <ContactLink hasBorder={true} />
                      ) : (
                        <>
                          <TransitionLink field={item.item} />
                          {index !==
                            lowNavigation.data.low_navigation_items.length -
                              1 && <div></div>}
                        </>
                      )}
                    </li>
                  ),
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
