import { create } from 'zustand';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (id) => set((state) => ({ items: [...state.items, { id, quantity: 1 }] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(item => item.id !== id) })),
}));
