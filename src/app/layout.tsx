import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import { ViewTransitions } from 'next-view-transitions';

import { Providers } from '@/Providers/Providers';

import LenisScrollProvider from '@/contexts/LenisContext';

import './globals.css';
import './reset.css';
import './animationglobals.css';

import Navigation from './components/Navigation/Navigation';
import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';
import Footer from './components/Footer/Footer';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';
import NewsletterForm from './components/NewsletterForm/NewsletterForm';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <Providers>
        <html lang="en">
          <body>
            <SignupButtonLarge />
            <ScrollIndicator />
            <Navigation />
            <LenisScrollProvider>{children}</LenisScrollProvider>
            <Footer /> <NewsletterForm />
          </body>
          <PrismicPreview repositoryName={repositoryName} />
        </html>
      </Providers>
    </ViewTransitions>
  );
}
