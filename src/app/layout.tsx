import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import { ViewTransitions } from 'next-view-transitions';

import { Providers } from '@/Providers/Providers';

import './globals.css';
import './reset.css';
import './animationglobals.css';

import Navigation from './components/Navigation/Navigation';
import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';
import Footer from './components/Footer/Footer';
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator';

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
            {children}
            <Footer />
          </body>
          <PrismicPreview repositoryName={repositoryName} />
        </html>
      </Providers>
    </ViewTransitions>
  );
}
