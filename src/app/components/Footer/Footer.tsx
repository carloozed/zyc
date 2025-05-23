import React from 'react';
import { createClient } from '@/prismicio';
import FooterContent from './FooterContent';

export default async function Footer() {
  const client = createClient();
  const footer = await client.getSingle('footer');
  const logo = await client.getSingle('logo');
  const navbar = await client.getSingle('navbar');
  const lownavigations = await client.getAllByType('low_navigation');
  const address = await client.getSingle('address');
  const subnavigation = await client.getSingle('subnavigation');
  return (
    <FooterContent
      footer={footer}
      logo={logo}
      navbar={navbar}
      lownavigations={lownavigations}
      address={address}
      subnavigation={subnavigation}
    />
  );
}
