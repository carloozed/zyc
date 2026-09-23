import { create } from 'zustand';

type GalleryStoreProps = {
  filter: string;
  galleryYear: string;
  hasAnimated: boolean;
  setFilter: (filter: string) => void;
  setGalleryYear: (galleryYear: string) => void;
  setHasAnimated: (hasAnimated: boolean) => void;
};

const useGalleryStore = create<GalleryStoreProps>((set) => ({
  filter: '',
  galleryYear: 'alle',
  hasAnimated: false,
  setFilter: (filter) => set({ filter }),
  setGalleryYear: (galleryYear) => set({ galleryYear }),
  setHasAnimated: (hasAnimated) => set({ hasAnimated }),
}));

export default useGalleryStore;
