import React from 'react';

import useContactStore from '@/stores/ContactFormStore';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
  hasBorder?: boolean;
  buttonText?: string;
};

export default function ContactLink({
  hasUnderscore,
  hasBorder = true,
  buttonText = 'Kontakt',
}: Props) {
  const { isContactFormShown, setContactFormShown } = useContactStore();
  const { isDesktop, isTabletLandscape, isTabletPortrait } = useMobile();

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: `${(hasBorder && isDesktop) || (hasBorder && isTabletLandscape) || (hasBorder && isTabletPortrait) ? '0.5px solid black' : 'none'}`,
        paddingRight: `${(hasBorder && isDesktop) || (hasBorder && isTabletLandscape) || (hasBorder && isTabletPortrait) ? 'var(--padding-m)' : '0'}`,
      }}
      onClick={() => setContactFormShown(!isContactFormShown)}
      className="cursor-pointer"
    >
      {buttonText}
    </span>
  );
}
