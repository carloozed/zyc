import { create } from 'zustand';

type GalleryAnimationStoreProps = {
  hasAnimated: boolean;
  setHasAnimated: (value: boolean) => void;
};

const useGalleryAnimationStore = create<GalleryAnimationStoreProps>((set) => ({
  hasAnimated: false,
  setHasAnimated: (value) => set({ hasAnimated: value }),
}));

export default useGalleryAnimationStore;
