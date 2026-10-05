'use client';

import React, { useState, useEffect } from 'react';
import { AnmeldelinkDocument } from '@/prismicio-types';
import { usePathname } from 'next/navigation';
import { PrismicNextLink } from '@prismicio/next';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';
import stripLocale from '@/helpers/stripLocale';
import isSignupOpen from '@/helpers/signupWindow';

type Locale = 'de-ch' | 'en-us';

type Props = {
  styles: Record<string, string>;
  signuplinks: Partial<Record<Locale, AnmeldelinkDocument>>;
};

/** Routes where the button stays parked off-screen. */
const HIDDEN_ON = ['/', '/the_cadenza', '/the_crescendo', '/ueber_zyc'];

export default function SignupButtonClient({ styles, signuplinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const pathname = usePathname();
  const lang = useLocaleFromPathname();
  const signuplink =
    signuplinks[lang] ?? signuplinks['de-ch'] ?? signuplinks['en-us'];

  // Decided after mount: the server's HTML can be older than today (magazine
  // posts are prerendered), so rendering it there would mismatch on hydration.
  useEffect(() => {
    setIsOpen(!!signuplink && isSignupOpen(signuplink));
  }, [signuplink]);

  // The button mounts off-screen; sliding it in two frames later lets the
  // browser paint that start position, so the transform transition runs.
  useEffect(() => {
    if (!isOpen) return;
    const show = !HIDDEN_ON.includes(stripLocale(pathname));
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsShown(show));
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, pathname]);

  if (!signuplink || !isOpen) return null;

  return (
    <div
      className={`${styles.signup__button} ${isShown ? styles.signup__button__shown : ''}`}
      // Parked off-screen it must not be reachable by keyboard either.
      inert={!isShown}
    >
      <PrismicNextLink field={signuplink.data.anmeldelink} />
    </div>
  );
}
