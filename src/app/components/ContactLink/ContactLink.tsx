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
  const showBorder = hasBorder && (isFooter || !isMobile);
  const paddingRight = !showBorder
    ? '0'
    : isFooter
      ? 'var(--padding-s)'
      : 'var(--padding-m)';

  return (
    <span
      style={{
        textDecoration: hasUnderscore ? 'underline' : 'none',
        borderRight: showBorder ? '0.5px solid black' : 'none',
        paddingRight,
      }}
      onClick={() => setContactFormShown(!isContactFormShown)}
      className="cursor-pointer"
    >
      {buttonText}
    </span>
  );
}
