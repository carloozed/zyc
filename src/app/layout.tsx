import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import { ViewTransitions } from 'next-view-transitions';

import Script from 'next/script';

// import { headers } from 'next/headers';

import { Providers } from '@/Providers/Providers';

import LenisScrollProvider from '@/contexts/LenisContext';

// import SplashScreen from './components/SplashScreen/SplashScreen';

import './globals.css';
import './reset.css';
import './animationglobals.css';

import Navigation from './components/Navigation/Navigation';
import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';
import Footer from './components/Footer/Footer';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';
import NewsletterForm from './components/NewsletterForm/NewsletterForm';
import ContactForm from './components/ContactForm/ContactForm';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* hello */
  return (
    <ViewTransitions>
      <Providers>
        <html lang="en">
          <body>
            <SignupButtonLarge />
            <ScrollIndicator />
            <Navigation />
            <LenisScrollProvider>{children}</LenisScrollProvider>
            <Footer />
            <NewsletterForm />
            <ContactForm />
            <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
          </body>
          <PrismicPreview repositoryName={repositoryName} />
        </html>
      </Providers>
    </ViewTransitions>
  );
}
