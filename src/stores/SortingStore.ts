import { KeyTextField } from '@prismicio/client';
import { create } from 'zustand';

type SortingStoreProps = {
  sorting: string | KeyTextField;
  setSortingStore: (sorting: string | KeyTextField) => void;
};

const useSortingStore = create<SortingStoreProps>((set) => ({
  sorting: 'neu',
  setSortingStore: (sorting) => set({ sorting: sorting }),
}));

export default useSortingStore;
