import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { email, firstname, surname } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    if (!apiKey || !listId) {
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        attributes: {
          VORNAME: firstname || '',
          NACHNAME: surname || '',
        },
        listIds: [parseInt(listId)],
        updateEnabled: true,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ message: 'Subscribed!' }, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.message || 'Internal Server Error' },
        { status: 500 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
