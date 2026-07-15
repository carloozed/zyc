'use client';

import React, { useState, useEffect } from 'react';
import { AnmeldelinkDocument } from '@/prismicio-types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import isSignupWindowOpen from '@/helpers/isSignupWindowOpen';

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

  const shouldRenderButton =
    signuplink.data.hide_button_boolean !== true &&
    isSignupWindowOpen(signuplink);

  if (!shouldRenderButton) {
    return null;
  }

  return (
    <div
      className={`${styles.signup__button} ${buttonIsVisible ? styles.signup__button__home : ''}`}
    >
      <Link href={signuplink.data.link_url ?? '#'} target="_blank">
        {signuplink.data.anmeldelink.text}
      </Link>
    </div>
  );
}
