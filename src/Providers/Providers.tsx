'use client';

import { MobileProvider } from '@/contexts/MobileContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <MobileProvider>{children}</MobileProvider>;
}
