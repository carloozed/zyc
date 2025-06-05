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
  const isDownloadsMutedObject = await client.getByType('isdownloadsmuted');
  const isTermineVisible = await client.getSingle('termine_is_visible');

  const isDownloadsMuted =
    isDownloadsMutedObject.results[0].data.isdownloadsmuted;

  const lowNavigation = lownavigations.find(
    (item) => item.uid === 'legal-information-contact'
  );

  return (
    <FooterContent
      footer={footer}
      logo={logo}
      navbar={navbar}
      lowNavigation={lowNavigation}
      address={address}
      subnavigation={subnavigation}
      isDownloadsMuted={isDownloadsMuted}
      termineIsVisible={isTermineVisible}
    />
  );
}
