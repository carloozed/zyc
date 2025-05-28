import { create } from 'zustand';

export const useDeviceStore = create((set) => ({
  isMobile: false,
  isTablet: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setIsTablet: (isTablet: boolean) => set({ isTablet }),
}));
