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

/*ökladsklf */
export default function ZYCMail({ name, message, email, surname }: FormData) {
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
        <Spacer />
        <Container style={imageContainer}>
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
            Neue Kontaktanfrage von {name} {surname}
          </Heading>
        </Container>
        <Container>
          <Text style={mainTextStyle as React.CSSProperties}>
            Nachricht: {message}
          </Text>
          <Spacer />
          <Text style={mainTextStyle as React.CSSProperties}>
            Email: {email}
          </Text>
          <Spacer />
        </Container>
      </Container>
    </Html>
  );
}

const imageContainer = {
  padding: '16px 0',
  width: '100%',
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
