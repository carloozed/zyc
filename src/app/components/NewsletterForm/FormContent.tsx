'use client';

import { useState } from 'react';
import styles from './NewsletterForm.module.css';
import { NewsletterFormDocument } from '../../../../prismicio-types';
import { PrismicNextImage } from '@prismicio/next';

export type NewsletterProps = {
  newsletter: NewsletterFormDocument;
};

export default function FormContent({ newsletter }: NewsletterProps) {
  const [formIsShown, setFormIsShown] = useState(false);
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Loading...');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstname, surname }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Deine Anmeldung war erfolgreich!');
      setEmail('');
      setFirstName('');
      setSurname('');
    } else {
      setStatus(data.error || 'Something went wrong.');
    }
  };

  return (
    <div
      className={`${styles.formcontainer} ${formIsShown ? styles.formcontainer__shown : ''}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={styles.cross__container}
          onClick={() => setFormIsShown(false)}
        >
          <div className={styles.cross}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={styles.form__image}>
          <PrismicNextImage field={newsletter.data.newsletter_image} />
        </div>
        <div className={styles.form__content}>
          <div className={styles.form__header}>
            <h2>Anmeldung Newsletter</h2>
            <p>
              Trag dich in unseren Newsletter ein – wir informieren dich
              regelmäßig über Neuigkeiten und spannende Inhalte.
            </p>
          </div>
          <div className={styles.form__inputs}>
            <div className={styles.inputGroup}>
              <label>Vorname</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Nachname</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>{' '}
          <button type="submit">Für Newsletter anmelden</button>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
}
