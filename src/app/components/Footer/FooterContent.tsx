import React from 'react';

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
  console.log(lownavigations);
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__logocontainer}>
        <div className={styles.footer__logo}>
          <PrismicNextImage field={logo.data.image} />
        </div>
      </div>
      <div className={styles.footer__addresscontainer}>
        <div className={styles.footer__address}>
          <PrismicRichText field={address.data.zyc} />
          <PrismicNextLink field={address.data.location_link} />
          <PrismicRichText field={address.data.street} />
          <PrismicRichText field={address.data.city} />
        </div>
      </div>
      <div className={styles.footer__lownavigationcontainer}>
        {lownavigations[1].data.low_navigation_items.map((item, index) => (
          <div key={index} className={styles.footer__lownavigation}>
            <PrismicNextLink field={item.item} />
          </div>
        ))}
      </div>
    </footer>
  );
}
