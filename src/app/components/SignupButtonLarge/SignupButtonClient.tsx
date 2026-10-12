'use client';

import React, { useState, useEffect, useRef } from 'react';
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

/** Routes where the button is visible. */
const SHOWN_ON = [
  '/the_contest',
  '/the_cadenza',
  '/the_crescendo',
  '/ueber_zyc',
];

/** Phones and portrait tablets, where the button is a bottom pill. Keep in
 * sync with the media query in SignupButtonLarge.module.css. */
const COMPACT_QUERY =
  '(max-width: 48rem), (min-width: 48rem) and (max-width: 74rem) and (orientation: portrait)';

export default function SignupButtonClient({ styles, signuplinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lang = useLocaleFromPathname();
  const signuplink =
    signuplinks[lang] ?? signuplinks['de-ch'] ?? signuplinks['en-us'];

  // Decided after mount: the server's HTML can be older than today (magazine
  // posts are prerendered), so rendering it there would mismatch on hydration.
  useEffect(() => {
    setIsOpen(!!signuplink && isSignupOpen(signuplink));
  }, [signuplink]);

  // As a bottom pill it steps aside while the page's own sign-up link or the
  // footer is on screen, so it never doubles up or covers the footer. The
  // targets are looked up on every check because parts of the page render
  // client-side after this effect runs.
  useEffect(() => {
    if (!isOpen) return;
    const compact = window.matchMedia(COMPACT_QUERY);
    let frame = 0;
    const check = () => {
      frame = 0;
      const ownLink = containerRef.current?.querySelector('a');
      if (!ownLink || !compact.matches) return setIsCovered(false);
      const targets = [
        ...Array.from(document.querySelectorAll('a')).filter(
          (link) => link !== ownLink && link.href === ownLink.href,
        ),
        ...Array.from(document.querySelectorAll('footer')),
      ];
      setIsCovered(
        targets.some((target) => {
          const rect = target.getBoundingClientRect();
          return (
            rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
          );
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      setIsCovered(false);
    };
  }, [isOpen, pathname]);

  // The button mounts off-screen; sliding it in two frames later lets the
  // browser paint that start position, so the transform transition runs.
  useEffect(() => {
    if (!isOpen) return;
    const show = SHOWN_ON.includes(stripLocale(pathname)) && !isCovered;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsShown(show));
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, pathname, isCovered]);

  if (!signuplink || !isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`${styles.signup__button} ${isShown ? styles.signup__button__shown : ''}`}
      // Parked off-screen it must not be reachable by keyboard either.
      inert={!isShown}
    >
      <PrismicNextLink field={signuplink.data.anmeldelink} />
    </div>
  );
}
