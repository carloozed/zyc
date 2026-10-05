'use client';

import React, { useState, useEffect } from 'react';
import { AnmeldelinkDocument } from '@/prismicio-types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';
import stripLocale from '@/helpers/stripLocale';
import isSignupOpen from '@/helpers/signupWindow';

type Locale = 'de-ch' | 'en-us';

type Props = {
  styles: Record<string, string>;
  signuplinks: Partial<Record<Locale, AnmeldelinkDocument>>;
};

export default function SignupButtonClient({ styles, signuplinks }: Props) {
  const [buttonIsVisible, setButtonIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const lang = useLocaleFromPathname();
  const signuplink =
    signuplinks[lang] ?? signuplinks['de-ch'] ?? signuplinks['en-us'];

  useEffect(() => {
    const hiddenOn = ['/', '/the_cadenza', '/the_crescendo', '/ueber_zyc'];
    setButtonIsVisible(!hiddenOn.includes(stripLocale(pathname)));
  }, [pathname]);

  // Decided after mount: the server's HTML can be older than today (magazine
  // posts are prerendered), so rendering it there would mismatch on hydration.
  useEffect(() => {
    setIsOpen(!!signuplink && isSignupOpen(signuplink));
  }, [signuplink]);

  if (!signuplink || !isOpen) return null;
  const data = signuplink.data;

  return (
    <div
      className={`${styles.signup__button} ${buttonIsVisible ? styles.signup__button__home : ''}`}
    >
      <Link href={data.link_url ?? '#'} target="_blank">
        {data.anmeldelink.text}
      </Link>
    </div>
  );
}
