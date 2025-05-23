import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import './globals.css';
import './reset.css';

import Navigation from './components/Navigation/Navigation';
import SignupButtonLarge from './components/SignupButtonLarge/SignupButtonLarge';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SignupButtonLarge />
        <Navigation />
        {children}
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
