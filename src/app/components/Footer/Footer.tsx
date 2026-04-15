import React from 'react';
import { createClient } from '@/prismicio';
import FooterContent from './FooterContent';

type FooterProps = {
  lang: string;
};

export default async function Footer({ lang }: FooterProps) {
  const client = createClient();
  const footer = await client.getSingle('footer', { lang });
  const logo = await client.getSingle('logo', { lang });
  const navbar = await client.getSingle('navbar', { lang });
  const lownavigations = await client.getAllByType('low_navigation', { lang });
  const address = await client.getSingle('address', { lang });
  const subnavigation = await client.getSingle('subnavigation', { lang });
  const isDownloadsMutedObject = await client.getByType('isdownloadsmuted', { lang });
  const isTermineVisible = await client.getSingle('termine_is_visible', { lang });

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
