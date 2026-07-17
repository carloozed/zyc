import { Text } from '@react-email/components';
import * as React from 'react';

import { FormData } from '../app/components/ContactForm/FormContent';
import EmailLayout, { Spacer, mainTextStyle } from './EmailLayout';

/*ökladsklf */
export default function ZYCMail({ name, message, email, surname }: FormData) {
  return (
    <EmailLayout
      imageContainerStyle={imageContainerStyle}
      heading={
        <>
          Neue Kontaktanfrage von {name} {surname}
        </>
      }
    >
      <Text style={mainTextStyle as React.CSSProperties}>
        Nachricht: {message}
      </Text>
      <Spacer />
      <Text style={mainTextStyle as React.CSSProperties}>
        Email: {email}
      </Text>
      <Spacer />
    </EmailLayout>
  );
}

const imageContainerStyle = {
  padding: '16px 0',
  width: '100%',
};
