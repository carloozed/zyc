'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import {
  AddressDocument,
  FooterDocument,
  LogoDocument,
  LowNavigationDocument,
  NavbarDocument,
  SubnavigationDocument,
  TermineIsVisibleDocument,
} from '@/prismicio-types';
import styles from './FooterContent.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { TransitionLink } from '../TransitionLink/TransitionLink';
import NewsletterLink from '../NewsletterLink/NewsletterLink';
import ContactLink from '../ContactLink/ContactLink';

type Props = {
  footer: FooterDocument;
  logo: LogoDocument;
  navbar: NavbarDocument;
  lowNavigation: LowNavigationDocument<string> | undefined;
  address: AddressDocument;
  subnavigation: SubnavigationDocument;
  isDownloadsMuted: boolean;
  termineIsVisible?: TermineIsVisibleDocument;
};

export default function FooterContent({
  footer,
  navbar,
  lowNavigation,
  subnavigation,
  logo,
  isDownloadsMuted,
}: Props) {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const filteredNavItems = navbar.data.navigation_items.filter(
    (item) =>
      item.item.text !== 'Home' && item.item.text !== 'Dein Weg mit ZYC',
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <div className={styles.footer__logocontainer}>
          <div className={styles.footer__logo}>
            <PrismicNextImage field={logo.data.image} />
          </div>
        </div>
      </div>

      <div className={styles.footer__main}>
        <div className={styles.footer__column}>
          <div className={styles.footer__subnavigation}>
            <h4 className={styles.footer__heading}>The Contest</h4>
            <div className={styles.footer__linklist}>
              {subnavigation.data.subnavigation_items.map((item, index) => (
                <div key={index} className={styles.footer__link}>
                  <TransitionLink field={item.link} />
                  <PrismicNextLink field={item.link}>
                    <p className={styles.rotate}>&#8595;</p>
                  </PrismicNextLink>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer__column}>
          <div className={styles.footer__navigation}>
            <h4 className={styles.footer__heading}>ZYC</h4>
            <div className={styles.footer__linklist}>
              {filteredNavItems.map((item, index) => {
                return (
                  <div key={index} className={styles.footer__link}>
                    <TransitionLink field={item.item} />
                    <PrismicNextLink field={item.item}>
                      <p className={styles.rotate}>&#8595;</p>
                    </PrismicNextLink>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isDownloadsMuted && (
          <div className={styles.footer__column}>
            <div className={styles.footer__downloadcontainer}>
              <h4 className={styles.footer__heading}>Downloads</h4>
              <div className={styles.footer__linklist}>
                {footer.data.downloads.map((item, index) => (
                  <div key={index} className={styles.footer__link}>
                    <PrismicNextLink field={item.link} target="_blank" />
                    <p className={styles.downloadarrow}>&#8595;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer__bottom}>
        <div className={styles.footer__lownavigationcontainer}>
          {lowNavigation &&
            lowNavigation.data.low_navigation_items.map((item, index, arr) => (
              <React.Fragment key={index}>
                <div className={styles.footer__lownavigation}>
                  {item.item.text === 'Newsletter' ? (
                    <NewsletterLink isFooter={true} hasBorder={false} />
                  ) : item.item.text === 'Kontakt' ? (
                    <ContactLink isFooter={true} hasBorder={false} />
                  ) : (
                    <TransitionLink field={item.item} />
                  )}
                </div>
                {index < arr.length - 1 && (
                  <div className={styles.footer__lownavigationDivider} />
                )}
              </React.Fragment>
            ))}
        </div>

        <div className={styles.footer__datecontainer}>
          <p>©{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
