import React from 'react';
import useNewsletterStore from '@/stores/NewsletterStore';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
  hasBorder?: boolean;
};

export default function NewsletterLink({
  hasUnderscore,
  hasAnmeldung,
  hasBorder = false,
}: Props) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  const { isDesktop, isTabletLandscape, isTabletPortrait } = useMobile();

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: `${(hasBorder && isDesktop) || (hasBorder && isTabletLandscape) || (hasBorder && isTabletPortrait) ? '0.5px solid black' : 'none'}`,
        paddingRight: `${(hasBorder && isDesktop) || (hasBorder && isTabletLandscape) || (hasBorder && isTabletPortrait) ? 'var(--padding-m)' : '0'}`,
      }}
      onClick={() => setNewsletterFormShown(!isNewsletterFormShown)}
      className="cursor-pointer"
    >
      {hasAnmeldung ? 'Anmeldung Newsletter' : 'Newsletter'}
    </span>
  );
}
