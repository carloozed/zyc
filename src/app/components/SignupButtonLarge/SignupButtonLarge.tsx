import React from 'react';
import { notFound } from 'next/navigation';
import styles from './SignupButtonLarge.module.css';

import { createClient } from '@/prismicio';

import SignupButtonClient from './SignupButtonClient';

// Rendered from the root layout, which has no locale segment, so both
// locales are fetched and the client picks one from the pathname.
export default async function SignupButtonLarge() {
  const client = createClient();
  const [de, en] = await Promise.all([
    client.getSingle('anmeldelink', { lang: 'de-ch' }).catch(() => null),
    client.getSingle('anmeldelink', { lang: 'en-us' }).catch(() => null),
  ]);
  if (!de && !en) notFound();
  return (
    <SignupButtonClient
      styles={styles}
      signuplinks={{ 'de-ch': de ?? undefined, 'en-us': en ?? undefined }}
    />
  );
}
