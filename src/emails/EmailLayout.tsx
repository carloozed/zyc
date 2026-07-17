import {
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
} from '@react-email/components';
import * as React from 'react';

export const Spacer = () => (
  <Container style={{ height: '24px', width: '100%' }}></Container>
);

export const mainTextStyle = {
  margin: 'auto',
  fontSize: '16px',
  textAlign: 'center',
};

type EmailLayoutProps = {
  imageContainerStyle: React.CSSProperties;
  heading: React.ReactNode;
  leadingSpace?: boolean;
  children: React.ReactNode;
};

export default function EmailLayout({
  imageContainerStyle,
  heading,
  leadingSpace = false,
  children,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Arial"
          fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Container>
        {leadingSpace && ' '}
        <Spacer />
        <Container style={imageContainerStyle}>
          <Link
            href="https://zurichyouthclassical.ch"
            style={{ margin: 'auto', width: '100%' }}
          >
            <Img
              src="https://images.prismic.io/zurichyouthclassical/aItgUKTt2nPbZmmx_logoquadratisch.png?auto=format,compress"
              alt="Logo Zurich Youth Classical"
              height="80"
              style={{ margin: 'auto' }}
            />
          </Link>
        </Container>
        <Container style={mainHeadingContainer}>
          <Heading style={mainHeading as React.CSSProperties}>
            {heading}
          </Heading>
        </Container>
        <Container>{children}</Container>
      </Container>
    </Html>
  );
}

const mainHeadingContainer = {
  fontWeight: 700,
  lineHeight: '32px',
  margin: '24px 0',
};

const mainHeading = {
  margin: 'auto',
  fontSize: '24px',
  textAlign: 'center',
};
