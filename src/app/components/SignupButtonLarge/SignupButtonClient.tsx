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
  const [buttonIsVisible, setButtonIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname === '/' ||
      pathname === '/the_cadenza' ||
      pathname === '/the_crescendo' ||
      pathname === '/ueber_zyc'
    ) {
      setButtonIsVisible(false);
    } else {
      setButtonIsVisible(true);
    }
  }, [pathname]);

  return (
    <div
      className={`${styles.signup__button} ${buttonIsVisible ? styles.signup__button__home : ''}`}
    >
      <PrismicNextLink field={signuplink.data.anmeldelink} />
    </div>
  );
}
