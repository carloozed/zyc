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
} from '../../../../prismicio-types';
import styles from './FooterContent.module.css';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { isFilled } from '@prismicio/client';

type Props = {
  footer: FooterDocument;
  logo: LogoDocument;
  navbar: NavbarDocument;
  lownavigations: LowNavigationDocument[];
  address: AddressDocument;
  subnavigation: SubnavigationDocument;
};

export default function FooterContent({
  footer,
  address,
  navbar,
  lownavigations,
  subnavigation,
  logo,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      {' '}
      {pathname === '/' ? null : (
        <footer className={styles.footer}>
          <div className={styles.footer__logocontainer}>
            <div className={styles.footer__logo}>
              <PrismicNextImage field={logo.data.image} />
            </div>
          </div>
          <div className={styles.footer__lowercontainer}>
            <div className={styles.footer__leftcontainer}>
              <div className={styles.footer__addresscontainer}>
                <div className={styles.footer__address}>
                  {(isFilled.richText(address.data.street) ||
                    isFilled.richText(address.data.city)) && (
                    <>
                      {' '}
                      <PrismicRichText field={address.data.zyc} />{' '}
                      <PrismicNextLink field={address.data.location_link}>
                        <PrismicRichText field={address.data.street} />
                        <PrismicRichText field={address.data.city} />
                      </PrismicNextLink>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.footer__lownavigationcontainer}>
                {lownavigations[1].data.low_navigation_items.map(
                  (item, index) => (
                    <div key={index} className={styles.footer__lownavigation}>
                      <PrismicNextLink field={item.item} />
                      <div></div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.footer__middlecontainer}>
              <div className={styles.footer__downloadcontainer}>
                {footer.data.downloads.map((item, index) => (
                  <div key={index} className={styles.footer__link}>
                    <PrismicNextLink field={item.link} />
                    <p>&#8595;</p>
                  </div>
                ))}
              </div>
              <div className={styles.footer__navigationcontainer}>
                <div className={styles.footer__subnavigation}>
                  {subnavigation.data.subnavigation_items.map((item, index) => (
                    <div key={index} className={styles.footer__link}>
                      <PrismicNextLink field={item.link} />
                      <p className={styles.rotate}>&#8595;</p>
                    </div>
                  ))}
                </div>
                <div className={styles.footer__navigation}>
                  {navbar.data.navigation_items
                    .filter(
                      (item) =>
                        item.item.text !== 'Home' &&
                        item.item.text !== 'Über ZYC' &&
                        item.item.text !== 'FAQ'
                    )
                    .map((item, index) => (
                      <div key={index} className={styles.footer__link}>
                        <PrismicNextLink field={item.item} />
                        <p className={styles.rotate}>&#8595;</p>
                      </div>
                    ))}
                </div>{' '}
              </div>
            </div>
            <div className={styles.footer__datecontainer}>
              {' '}
              ©{new Date().getFullYear()}
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
