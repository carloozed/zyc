import React from 'react';
import useNewsletterStore from '@/stores/NewsletterStore';

type Props = {
  hasUnderscore?: boolean;
  hasAnmeldung?: boolean;
};

export default function NewsletterLink({ hasUnderscore, hasAnmeldung }: Props) {
  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

  return (
    <span
      style={{ textDecoration: hasUnderscore ? 'underline' : 'none' }}
      onClick={() => setNewsletterFormShown(!isNewsletterFormShown)}
      className="cursor-pointer"
    >
      {hasAnmeldung ? 'Anmeldung Newsletter' : 'Newsletter'}
    </span>
  );
}
