import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity?: number; // Optional for perfect backward-compatibility with other modules
  portal: 'pk-shop' | 'b2c' | 'b2b' | 'service' | 'logistics';
  coinCashback?: number;
  vendorId?: string;
  vendorName?: string;
  variantInfo?: string;
  moq?: number; // Minimum Order Quantity for B2B wholesale validation
  stock?: number; // Optional for backward-compatibility
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalCoins: () => number;
}

// Global browser event launcher for event-driven coordination
const emitCartEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const qtyToAdd = newItem.quantity || 1;
          const maxStock = newItem.stock || 99;
          
          const existingItem = state.items.find(item => item.id === newItem.id);
          let updatedItems;
          
          if (existingItem) {
            const currentQty = existingItem.quantity || 1;
            const currentStock = existingItem.stock || 99;
            updatedItems = state.items.map(item =>
              item.id === newItem.id 
                ? { ...item, quantity: Math.min(currentStock, currentQty + qtyToAdd) } 
                : item
            );
          } else {
            const itemToPush: CartItem = {
              ...newItem,
              quantity: qtyToAdd,
              stock: maxStock
            };
            updatedItems = [...state.items, itemToPush];
          }
          
          return { items: updatedItems };
        });
        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      removeItem: (id) => {
        set((state) => {
          const nextItems = state.items.filter(item => item.id !== id);
          return { items: nextItems };
        });
        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find(i => i.id === id);
          if (!item) return { items: state.items };
          
          const maxStock = item.stock || 99;
          const boundedQuantity = Math.max(1, Math.min(maxStock, quantity));
          
          return {
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity: boundedQuantity } : i
            )
          };
        });

        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      clearCart: () => {
        set({ items: [] });
        emitCartEvent('CART_UPDATED', { items: [] });
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },
      getTotalCoins: () => {
        return get().items.reduce((total, item) => total + ((item.coinCashback || 0) * (item.quantity || 1)), 0);
      }
    }),
    {
      name: 'pm-cart-storage-v2',
    }
  )
);
