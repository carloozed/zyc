import { create } from 'zustand';

type State = {
  isContactFormShown: boolean;
};

type Actions = {
  setContactFormShown: (isShown: boolean) => void;
};

const useContactStore = create<State & Actions>((set) => ({
  isContactFormShown: false,
  setContactFormShown: (isShown) => set({ isContactFormShown: isShown }),
}));

export default useContactStore;
