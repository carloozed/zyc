import { Resend } from 'resend';

import { NextResponse } from 'next/server';

import { FormData } from '@/app/components/ContactForm/FormContent';

import ResponseEmail from '@/emails/ResponseMail';
import ZYCMail from '@/emails/ZYCMail';

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(request: Request) {
  // First, get the form data from the request
  const formData: FormData = await request.json();

  const { name, surname } = formData;

  try {
    const [data, ozelotData] = await Promise.all([
      resend.emails.send({
        from: 'ZYC - Zurich Youth Classical <office@zurichyouthclassical.ch>',
        to: formData.email,
        subject: 'Zurich Youth Classical - Kontaktformular',
        react: ResponseEmail(formData),
      }),
      resend.emails.send({
        from: 'Website Kontaktformular <office@zurichyouthclassical.ch>',
        to: 'office@zurichyouthclassical.ch',
        subject: `${name} ${surname} hat eine Kontaktanfrage geschickt`,
        react: ZYCMail(formData),
      }),
    ]);

    return NextResponse.json({ success: true, data, ozelotData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
