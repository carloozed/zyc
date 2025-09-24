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
}: Props) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  const { isMobile } = useMobile();

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: `${hasBorder && !isMobile ? '0.5px solid black' : 'none'}`,
        paddingRight: `${hasBorder && !isMobile ? 'var(--padding-m)' : '0'}`,
      }}
      onClick={() => setNewsletterFormShown(!isNewsletterFormShown)}
      className="cursor-pointer"
    >
      {hasAnmeldung ? 'Anmeldung Newsletter' : 'Newsletter'}
    </span>
  );
}
