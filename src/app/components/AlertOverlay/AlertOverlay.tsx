import React from 'react';

type AlertOverlayProps = { lang: string };

import { createClient } from '@/prismicio';
import AlertOverlayContent from './AlertOverlayContent';

export default async function AlertOverlay({ lang }: AlertOverlayProps) {
  const client = createClient();
  const overlay = await client.getSingle('alertoverlay', { lang });

  return <AlertOverlayContent overlay={overlay} />;
}
