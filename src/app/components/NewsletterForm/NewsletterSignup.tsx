'use client';

import { useId, useState } from 'react';

import { NewsletterFormDocument } from '@/prismicio-types';
import useLocaleFromPathname from '@/helpers/useLocaleFromPathname';

import styles from './NewsletterSignup.module.css';

type Props = {
  newsletter: NewsletterFormDocument;
  /** Called after a successful subscription, once the status text is shown. */
  onSuccess?: () => void;
};

/** The newsletter fields, button and status line. Shared by the modal
 * (`FormContent`) and the standalone /newsletter page; title, text and the
 * surrounding layout belong to the caller. */
export default function NewsletterSignup({ newsletter, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [status, setStatus] = useState('');
  const id = useId();
  const lang = useLocaleFromPathname();
  const en = lang === 'en-us';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(en ? 'Sending...' : 'Wird gesendet...');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstname, surname }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(
          data.error ||
            (en ? 'Something went wrong.' : 'Etwas ist schiefgelaufen.'),
        );
        return;
      }

      setStatus(
        en
          ? 'You have successfully signed up!'
          : 'Deine Anmeldung war erfolgreich!',
      );
      setEmail('');
      setFirstName('');
      setSurname('');
      onSuccess?.();
    } catch {
      setStatus(en ? 'Something went wrong.' : 'Etwas ist schiefgelaufen.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label htmlFor={`${id}-firstname`}>{newsletter.data.vorname}</label>
          <input
            id={`${id}-firstname`}
            type="text"
            autoComplete="given-name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor={`${id}-surname`}>{newsletter.data.nachname}</label>
          <input
            id={`${id}-surname`}
            type="text"
            autoComplete="family-name"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor={`${id}-email`}>{newsletter.data.email}</label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit">{newsletter.data.button_text}</button>
      <p>{status}</p>
    </form>
  );
}
