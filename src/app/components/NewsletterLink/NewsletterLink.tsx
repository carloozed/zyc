import React from 'react';
import useNewsletterStore from '@/stores/NewsletterStore';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
  hasBorder?: boolean;
  isFooter?: boolean;
  /** Overrides the built-in German label. */
  label?: string;
};

export default function NewsletterLink({
  hasUnderscore,
  hasAnmeldung,
  hasBorder = true,
  isFooter = false,
  label,
}: Props) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  const { isMobile } = useMobile();
  const showBorder = hasBorder && (isFooter || !isMobile);
  const paddingRight = !showBorder
    ? '0'
    : isFooter
      ? 'var(--padding-s)'
      : 'var(--padding-m)';
  const text =
    label ?? (hasAnmeldung ? 'Anmeldung Newsletter' : 'Newsletter');

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
      {text}
    </span>
  );
}
