import React from 'react';

import useContactStore from '@/stores/ContactFormStore';

import { useMobile } from '@/contexts/MobileContext';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
  hasBorder?: boolean;
  buttonText?: string;
  isFooter?: boolean;
};

export default function ContactLink({
  hasUnderscore,
  hasBorder = false,
  buttonText = 'Kontakt',
  isFooter = false,
}: Props) {
  const { isContactFormShown, setContactFormShown } = useContactStore();
  const { isMobile } = useMobile();

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: `${hasBorder && !isMobile ? '0.5px solid black' : isFooter ? '0.5px solid black' : 'none'}`,
        paddingRight: `${hasBorder && !isMobile ? 'var(--padding-m)' : isFooter ? 'var(--padding-m)' : '0'}`,
      }}
      onClick={() => setContactFormShown(!isContactFormShown)}
      className="cursor-pointer"
    >
      {buttonText}
    </span>
  );
}
