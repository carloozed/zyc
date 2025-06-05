import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import { ViewTransitions } from 'next-view-transitions';

import { headers } from 'next/headers';

import { Providers } from '@/Providers/Providers';

import LenisScrollProvider from '@/contexts/LenisContext';

import SplashScreen from './components/SplashScreen/SplashScreen';

import './globals.css';
import './reset.css';
import './animationglobals.css';

import Navigation from './components/Navigation/Navigation';
import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';
import Footer from './components/Footer/Footer';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';
import NewsletterForm from './components/NewsletterForm/NewsletterForm';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const domain = headerList.get('host') || 'localhost';

  const renderBody = () => {
    if (domain.includes('splash-domain.com')) {
      return <SplashScreen />;
    } else {
      return (
        <>
          <SplashScreen />
          <SignupButtonLarge />
          <ScrollIndicator />
          <Navigation />
          <LenisScrollProvider>{children}</LenisScrollProvider>
          <Footer />
          <NewsletterForm />
        </>
      );
    }
  };

  return (
    <ViewTransitions>
      <Providers>
        <html lang="en">
          <body>
            {renderBody()}
            {/* <SignupButtonLarge />
            <ScrollIndicator />
            <Navigation />
            <LenisScrollProvider>{children}</LenisScrollProvider>
            <Footer /> <NewsletterForm /> */}
          </body>
          <PrismicPreview repositoryName={repositoryName} />
        </html>
      </Providers>
    </ViewTransitions>
  );
}
