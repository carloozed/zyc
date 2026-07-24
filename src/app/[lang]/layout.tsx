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
    /* The root layout can't know the locale, so the html tag says lang="en".
       This wrapper re-declares the real locale for everything below it —
       without it the browser hyphenates German text with the English
       dictionary, i.e. not at all. display: contents keeps it out of layout. */
    <div lang={lang} style={{ display: 'contents' }}>
      <AlertOverlay lang={lang} />
      <Navigation lang={lang} />
      {children}
      <Footer lang={lang} />
      <NewsletterForm lang={lang} />
      <ContactForm lang={lang} />
    </div>
  );
}
