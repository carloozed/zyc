import React from 'react';
import useNewsletterStore from '@/stores/NewsletterStore';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
  hasBorder?: boolean;
  isFooter?: boolean;
};

export default function NewsletterLink({
  hasUnderscore,
  hasAnmeldung,
  hasBorder = true,
  isFooter = false,
}: Props) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  const { isMobile } = useMobile();
  const showBorder = isFooter || (hasBorder && !isMobile);
  const paddingRight = isFooter
    ? 'var(--padding-s)'
    : showBorder
      ? 'var(--padding-m)'
      : '0';
  const label = hasAnmeldung ? 'Anmeldung Newsletter' : 'Newsletter';

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: showBorder ? '0.5px solid black' : 'none',
        paddingRight,
      }}
      onClick={() => setNewsletterFormShown(!isNewsletterFormShown)}
      className="cursor-pointer"
    >
      {label}
    </span>
  );
}
