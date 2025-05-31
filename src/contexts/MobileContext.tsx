'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface MobileContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTabletPortrait: boolean;
  isTabletLandscape: boolean;
  orientation: 'portrait' | 'landscape';
}

const MobileContext = createContext<MobileContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTabletPortrait: false,
  isTabletLandscape: false,
  orientation: 'landscape',
});

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isTabletPortrait, setIsTabletPortrait] = useState(false);
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'landscape'
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;

      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      const desktop = width >= 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsDesktop(desktop);
      setOrientation(isPortrait ? 'portrait' : 'landscape');

      // Tablet portrait detection
      setIsTabletPortrait(tablet && isPortrait);
      setIsTabletLandscape(tablet && !isPortrait);
    };

    // Initial check
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Add event listener for orientation change (mobile devices)
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(handleResize, 100);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        isTabletPortrait,
        isTabletLandscape,
        orientation,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
}

// Custom hook to use the mobile context
export function useMobile() {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}
