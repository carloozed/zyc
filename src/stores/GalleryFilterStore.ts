import { KeyTextField } from '@prismicio/client';
import { create } from 'zustand';

type GalleryFilterStoreProps = {
  filter: string | KeyTextField;
  setFilter: (filter: string | KeyTextField) => void;
};

const useGalleryFilterStore = create<GalleryFilterStoreProps>((set) => ({
  filter: '',
  setFilter: (filter) => set({ filter: filter }),
}));

export default useGalleryFilterStore;
