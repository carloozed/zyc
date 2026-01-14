import { KeyTextField } from '@prismicio/client';
import { create } from 'zustand';

type FilterStoreProps = {
  filter: string | KeyTextField;
  setFilter: (filter: string | KeyTextField) => void;
};

const useFilterStore = create<FilterStoreProps>((set) => ({
  filter: '',
  setFilter: (filter) => set({ filter: filter }),
}));

export default useFilterStore;
