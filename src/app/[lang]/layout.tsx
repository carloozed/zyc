import React from 'react';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';
import NewsletterForm from '../components/NewsletterForm/NewsletterForm';
import ContactForm from '../components/ContactForm/ContactForm';

import AlertOverlay from '../components/AlertOverlay/AlertOverlay';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <AlertOverlay lang={lang} />
      <Navigation lang={lang} />
      {children}
      <Footer lang={lang} />
      <NewsletterForm lang={lang} />
      <ContactForm lang={lang} />
    </>
  );
}
