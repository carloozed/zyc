import { create } from 'zustand';

export type GalleryMediaType = 'photos' | 'videos';

type GalleryStoreProps = {
  filter: string;
  galleryYear: string;
  mediaType: GalleryMediaType;
  hasAnimated: boolean;
  setFilter: (filter: string) => void;
  setGalleryYear: (galleryYear: string) => void;
  setMediaType: (mediaType: GalleryMediaType) => void;
  setHasAnimated: (hasAnimated: boolean) => void;
};

const useGalleryStore = create<GalleryStoreProps>((set) => ({
  filter: '',
  galleryYear: 'alle',
  mediaType: 'photos',
  hasAnimated: false,
  setFilter: (filter) => set({ filter }),
  setGalleryYear: (galleryYear) => set({ galleryYear }),
  setMediaType: (mediaType) => set({ mediaType }),
  setHasAnimated: (hasAnimated) => set({ hasAnimated }),
}));

export default useGalleryStore;
