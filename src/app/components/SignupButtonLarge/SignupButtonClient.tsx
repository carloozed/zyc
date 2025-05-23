'use client';

import React, { useState, useEffect } from 'react';
import { AnmeldelinkDocument } from '../../../../prismicio-types';
import { PrismicNextLink } from '@prismicio/next';
import { usePathname } from 'next/navigation';

type Props = {
  styles: Record<string, string>;
  signuplink: AnmeldelinkDocument;
};

export default function SignupButtonClient({ styles, signuplink }: Props) {
  const [isHome, setIsHome] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [pathname]);

  return (
    <div
      className={`${styles.signup__button} ${isHome ? styles.signup__button__home : ''}`}
    >
      <PrismicNextLink field={signuplink.data.anmeldelink} />
    </div>
  );
}
