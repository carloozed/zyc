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

import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';

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
            <LenisScrollProvider>{children}</LenisScrollProvider>

            <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
          </body>
          <PrismicPreview repositoryName={repositoryName} />
        </html>
      </Providers>
    </ViewTransitions>
  );
}
