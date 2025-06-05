import { create } from 'zustand';

type State = {
  isNewsletterFormShown: boolean;
};

type Actions = {
  setNewsletterFormShown: (isShown: boolean) => void;
};

const useNewsletterStore = create<State & Actions>((set) => ({
  isNewsletterFormShown: false,
  setNewsletterFormShown: (isShown) => set({ isNewsletterFormShown: isShown }),
}));

export default useNewsletterStore;
