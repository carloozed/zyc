'use client';

import React, { useState, useEffect } from 'react';
import { AnmeldelinkDocument } from '@/prismicio-types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

type Locale = 'de-ch' | 'en-us';

type Props = {
  styles: Record<string, string>;
  signuplinks: Partial<Record<Locale, AnmeldelinkDocument>>;
};

export default function SignupButtonClient({ styles, signuplinks }: Props) {
  const [buttonIsVisible, setButtonIsVisible] = useState(false);
  const pathname = usePathname();
  const lang = useLocaleFromPathname();
  const signuplink =
    signuplinks[lang] ?? signuplinks['de-ch'] ?? signuplinks['en-us'];

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

  if (!signuplink) return null;
  const data = signuplink.data;

  const shouldShowBasedOnDates = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const buttonShowDate =
      data.show_button_date?.split('T')[0] || data.show_button_date;
    const buttonHideDate =
      data.hide_button_date?.split('T')[0] || data.hide_button_date;

    if (!buttonShowDate) return false;

    const isPastShowDate = currentDate >= buttonShowDate;

    if (!buttonHideDate) return isPastShowDate;

    const isBeforeHideDate = currentDate < buttonHideDate;

    return isPastShowDate && isBeforeHideDate;
  };

  const shouldRenderButton = () => {
    if (data.hide_button_boolean === true) {
      return false;
    }

    if (data.hide_button_boolean === false) {
      return shouldShowBasedOnDates();
    }

    return shouldShowBasedOnDates();
  };

  if (!shouldRenderButton()) {
    return null;
  }

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
