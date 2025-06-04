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

  const shouldShowBasedOnDates = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const buttonShowDate =
      signuplink.data.show_button_date?.split('T')[0] ||
      signuplink.data.show_button_date;
    const buttonHideDate =
      signuplink.data.hide_button_date?.split('T')[0] ||
      signuplink.data.hide_button_date;

    if (!buttonShowDate) return false;

    const isPastShowDate = currentDate >= buttonShowDate;

    if (!buttonHideDate) return isPastShowDate;

    const isBeforeHideDate = currentDate < buttonHideDate;

    return isPastShowDate && isBeforeHideDate;
  };

  const shouldRenderButton = () => {
    if (signuplink.data.hide_button_boolean === true) {
      return false;
    }

    if (signuplink.data.hide_button_boolean === false) {
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
      <PrismicNextLink field={signuplink.data.anmeldelink} />
    </div>
  );
}
