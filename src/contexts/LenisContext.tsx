// lenis-provider.tsx
'use client';
import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';

type LenisScrollProviderProps = {
  children: React.ReactNode;
};

// Every new page starts at the top. Without this, a link clicked while
// Lenis is still easing out a scroll keeps that animation running on the new
// page, so a magazine post opened mid-scroll lands at its bottom. The
// immediate jump also cancels the running animation.
function ScrollToTopOnRouteChange() {
  const lenis = useLenis();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (!lenis || previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [lenis, pathname]);

  return null;
}

const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef(null);
  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.1, duration: 2.5, smoothWheel: true }}
    >
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
