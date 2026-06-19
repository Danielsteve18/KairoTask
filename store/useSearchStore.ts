import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (q: string) => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  isOpen: false,
  query: "",
  open: () => set({ isOpen: true, query: "" }),
  close: () => set({ isOpen: false, query: "" }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen, query: "" })),
  setQuery: (query) => set({ query }),
}));
