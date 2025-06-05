'use client';

import { useState } from 'react';
import styles from './NewsletterForm.module.css';
import { NewsletterFormDocument } from '../../../../prismicio-types';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import useNewsletterStore from '@/stores/NewsletterStore';

export type NewsletterProps = {
  newsletter: NewsletterFormDocument;
};

export default function FormContent({ newsletter }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [status, setStatus] = useState('');

  const { isNewsletterFormShown, setNewsletterFormShown } =
    useNewsletterStore();

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
      setTimeout(() => {
        setNewsletterFormShown(false);
      }, 1000);
    } else {
      setStatus(data.error || 'Something went wrong.');
    }
  };

  return (
    <div
      className={`${styles.formcontainer} ${isNewsletterFormShown ? styles.formcontainer__shown : ''}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={styles.cross__container}
          onClick={() => setNewsletterFormShown(false)}
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
            <PrismicRichText field={newsletter.data.newsletter_title} />
            <PrismicRichText field={newsletter.data.newsletter_text} />
          </div>
          <div className={styles.form__inputs}>
            <div className={styles.inputGroup}>
              <label>{newsletter.data.vorname}</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{newsletter.data.nachname}</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{newsletter.data.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>{' '}
          <button type="submit">{newsletter.data.button_text}</button>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
}
