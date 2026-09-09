import React from 'react';
import { type Metadata } from 'next';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const en = lang === 'en-us';

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h2>
        {en
          ? 'You have successfully signed up for the newsletter!'
          : 'Du hast dich erfolgreich für den Newsletter angemeldet!'}
      </h2>
      <h3>
        {en
          ? 'You will receive a confirmation email shortly'
          : 'In Kürze erhältst du eine Bestätigungs-Mail'}
      </h3>
    </div>
  );
}

/** Only reached from the confirmation email; keep it out of search results. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title:
      lang === 'en-us'
        ? 'ZYC | Newsletter confirmed'
        : 'ZYC | Newsletter bestätigt',
    robots: { index: false, follow: false },
  };
}
