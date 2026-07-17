import { Link, Text } from '@react-email/components';
import * as React from 'react';

import { FormData } from '../app/components/ContactForm/FormContent';
import EmailLayout, { Spacer, mainTextStyle } from './EmailLayout';

export default function ResponseEmail({ name }: FormData) {
  return (
    <EmailLayout
      imageContainerStyle={imageContainerStyle}
      heading={<>Hallo {name.trim()}, danke für deine Nachricht!</>}
      leadingSpace
    >
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
    </EmailLayout>
  );
}

const imageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px 0',
};

const linkStyle = {
  color: 'inherit',
  textDecoration: 'underline',
};
