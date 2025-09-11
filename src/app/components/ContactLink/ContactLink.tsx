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
  const { isDesktop } = useMobile();

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: `${hasBorder && isDesktop ? '0.5px solid black' : 'none'}`,
        paddingRight: `${hasBorder && isDesktop ? 'var(--padding-m)' : '0'}`,
      }}
      onClick={() => setContactFormShown(!isContactFormShown)}
      className="cursor-pointer"
    >
      {buttonText}
    </span>
  );
}
