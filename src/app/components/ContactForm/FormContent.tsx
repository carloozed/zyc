'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';
import { ContactFormDocument } from '../../../../prismicio-types';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import useContactStore from '@/stores/ContactFormStore';

export type ContactFormProps = {
  contactForm: ContactFormDocument;
};

export interface FormData {
  name: string;
  surname: string;
  email: string;
  message: string;
  newsletter: boolean;
}

export default function FormContent({ contactForm }: ContactFormProps) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const { isContactFormShown, setContactFormShown } = useContactStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Loading...');
    const res = await fetch('/api/emails/main', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: firstname, surname, message }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Herzlichen Dank für deine Nachricht!');
      setEmail('');
      setFirstName('');
      setSurname('');
      setMessage('');
      setTimeout(() => {
        setContactFormShown(false);
      }, 1000);
    } else {
      setStatus(data.error || 'Something went wrong.');
    }
  };

  return (
    <div
      className={`${styles.formcontainer} ${isContactFormShown ? styles.formcontainer__shown : ''}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={styles.cross__container}
          onClick={() => setContactFormShown(false)}
        >
          <div className={styles.cross}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={styles.form__image}>
          <PrismicNextImage field={contactForm.data.image} />
        </div>
        <div className={styles.form__content}>
          <div className={styles.form__header}>
            <PrismicRichText field={contactForm.data.contact_title} />
            <PrismicRichText field={contactForm.data.contact_text} />
          </div>
          <div className={styles.form__inputs}>
            <div className={styles.inputGroup}>
              <label>{contactForm.data.vorname}</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{contactForm.data.nachname}</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{contactForm.data.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>{contactForm.data.deine_nachricht}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>{' '}
          <button type="submit">{contactForm.data.button_text}</button>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
}
