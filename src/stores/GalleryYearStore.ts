import { KeyTextField } from '@prismicio/client';
import { create } from 'zustand';

type GalleryYearProps = {
  galleryYear: string | KeyTextField;
  setGalleryYear: (galleryYear: string | KeyTextField) => void;
};

const useGalleryYearStore = create<GalleryYearProps>((set) => ({
  galleryYear: 'alle',
  setGalleryYear: (galleryYear) => set({ galleryYear: galleryYear }),
}));

export default useGalleryYearStore;
