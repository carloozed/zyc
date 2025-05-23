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

type Props = {
  footer: FooterDocument;
  logo: LogoDocument;
  navbar: NavbarDocument;
  lownavigations: LowNavigationDocument[];
  address: AddressDocument;
  subnavigation: SubnavigationDocument;
};

export default function FooterContent({ footer }: Props) {
  console.log(footer);
  return <footer className={styles.footer}>FooterContent</footer>;
}
