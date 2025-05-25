import React from 'react';
import { notFound } from 'next/navigation';
import styles from './SignupButtonLarge.module.css';

import { createClient } from '@/prismicio';

import SignupButtonClient from './SignupButtonClient';

export default async function SignupButtonLarge() {
  const client = createClient();
  const signuplink = await client
    .getSingle('anmeldelink')
    .catch(() => notFound());
  return <SignupButtonClient styles={styles} signuplink={signuplink} />;
}
