import { create } from 'zustand';

interface FeedStore {
  items: any[];
  isLoading: boolean;
  setItems: (items: any[]) => void;
  addItem: (item: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  setLoading: (isLoading) => set({ isLoading }),
}));
