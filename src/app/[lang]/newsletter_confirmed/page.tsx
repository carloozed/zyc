import React from 'react';

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
