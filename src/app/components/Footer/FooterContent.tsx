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
} from '../../../../prismicio-types';
import styles from './FooterContent.module.css';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { isFilled } from '@prismicio/client';
import { TransitionLink } from '../TransitionLink/TransitionLink';
import NewsletterLink from '../NewsletterLink/NewsletterLink';

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
  address,
  navbar,
  lowNavigation,
  subnavigation,
  logo,
  isDownloadsMuted,
  termineIsVisible,
}: Props) {
  const pathname = usePathname();

  return (
    <>
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
                {lowNavigation &&
                  lowNavigation.data.low_navigation_items.map((item, index) => (
                    <div key={index} className={styles.footer__lownavigation}>
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
                    </div>
                  ))}
              </div>
            </div>
            <div className={styles.footer__middlecontainer}>
              {isDownloadsMuted && (
                <div className={styles.footer__downloadcontainer}>
                  {footer.data.downloads.map((item, index) => (
                    <div key={index} className={styles.footer__link}>
                      <TransitionLink field={item.link} />{' '}
                      <p className={styles.rotate}>&#8595;</p>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.footer__navigationcontainer}>
                <div className={styles.footer__subnavigation}>
                  {subnavigation.data.subnavigation_items.map((item, index) => (
                    <div key={index} className={styles.footer__link}>
                      <TransitionLink field={item.link} />{' '}
                      <PrismicNextLink field={item.link}>
                        <p className={styles.rotate}>&#8595;</p>{' '}
                      </PrismicNextLink>
                    </div>
                  ))}
                </div>
                <div className={styles.footer__navigation}>
                  {navbar.data.navigation_items
                    .filter(
                      (item) =>
                        item.item.text !== 'Home' &&
                        item.item.text !== 'Dein Weg mit ZYC'
                    )
                    .map((item, index) => (
                      <div key={index}>
                        {termineIsVisible?.data.termine_is_visible === false &&
                        item.item.text === 'Termine' ? null : (
                          <div key={index} className={styles.footer__link}>
                            <TransitionLink field={item.item} />{' '}
                            <PrismicNextLink field={item.item}>
                              <p className={styles.rotate}>&#8595;</p>{' '}
                            </PrismicNextLink>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className={styles.footer__datecontainer}>
              <p>©{new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
