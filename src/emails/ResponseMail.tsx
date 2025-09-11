import {
  Html,
  Head,
  Container,
  Font,
  Heading,
  Text,
  Img,
  Link,
} from '@react-email/components';
import * as React from 'react';

import { FormData } from '../app/components/ContactForm/FormContent';

const Spacer = () => (
  <Container style={{ height: '24px', width: '100%' }}></Container>
);

export default function ResponseEmail({ name }: FormData) {
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
        {' '}
        <Spacer />
        <Container style={imageContainer}>
          <Link href="https://zurichyouthclassical.ch">
            <Img
              src="https://images.prismic.io/zurichyouthclassical/aItgUKTt2nPbZmmx_logoquadratisch.png?auto=format,compress"
              alt="Logo Zurich Youth Classical"
              height="80"
            />
          </Link>
        </Container>
        <Container style={mainHeadingContainer}>
          <Heading style={mainHeading as React.CSSProperties}>
            Hallo {name.trim()}, danke für deine Nachricht!
          </Heading>
        </Container>
        <Container>
          <Text style={mainTextStyle as React.CSSProperties}>
            Wir werden uns so schnell wie möglich bei dir melden. Falls du
            weitere Informationen benötigst, kannst du diese auf unserer{' '}
            <Link href="https://zurichyouthclassical.ch" style={linkStyle}>
              Website
            </Link>{' '}
            finden.
          </Text>{' '}
          <Spacer />
          <Text style={mainTextStyle as React.CSSProperties}>
            Mit freundlichen Grüssen,
          </Text>
          <Spacer />
          <Text style={mainTextStyle as React.CSSProperties}>
            dein Zurich Youth Classical Team
          </Text>
        </Container>
      </Container>
    </Html>
  );
}

const imageContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px 0',
};

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

const mainTextStyle = {
  margin: 'auto',
  fontSize: '16px',
  textAlign: 'center',
};

const linkStyle = {
  color: 'inherit',
  textDecoration: 'underline',
};
