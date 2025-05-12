import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';

import './globals.css';
import './reset.css';

import Navigation from './components/Navigation/Navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
