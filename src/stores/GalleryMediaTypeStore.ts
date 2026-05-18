import { create } from 'zustand';

export type GalleryMediaType = 'photos' | 'videos';

type GalleryMediaTypeStoreProps = {
  mediaType: GalleryMediaType;
  setMediaType: (mediaType: GalleryMediaType) => void;
};

const useGalleryMediaTypeStore = create<GalleryMediaTypeStoreProps>((set) => ({
  mediaType: 'photos',
  setMediaType: (mediaType) => set({ mediaType }),
}));

export default useGalleryMediaTypeStore;
