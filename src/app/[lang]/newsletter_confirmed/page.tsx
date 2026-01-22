import React from 'react';

export default function page() {
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
      <h2>Du hast dich erfolgreich für den Newsletter angemeldet!</h2>
      <h3>In Kürze erhälst du eine Bestätigungs-Mail</h3>
    </div>
  );
}
