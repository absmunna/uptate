import { create } from 'zustand';
import { Shop, nearbyShopService } from './nearbyShopService';

interface NearByShopState {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  filters: {
    radius: number;
    category: string;
    minRating: number;
    openNow: boolean;
    verifiedOnly: boolean;
    sortBy: 'distance' | 'rating' | 'popularity';
  };
  selectedShop: Shop | null;
  
  setFilter: (key: string, value: any) => void;
  setSelectedShop: (shop: Shop | null) => void;
  fetchShops: (lat: number, lng: number) => Promise<void>;
}

export const useNearbyShopStore = create<NearByShopState>((set, get) => ({
  shops: [],
  isLoading: false,
  error: null,
  filters: {
    radius: 10,
    category: '',
    minRating: 0,
    openNow: false,
    verifiedOnly: false,
    sortBy: 'distance'
  },
  selectedShop: null,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    }));
  },

  setSelectedShop: (shop) => set({ selectedShop: shop }),

  fetchShops: async (lat, lng) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const shops = await nearbyShopService.getNearbyShops({
        lat,
        lng,
        radius: filters.radius,
        category: filters.category || undefined
      });

      // Apply frontend-only filtering and sorting
      let processedShops = [...shops];

      if (filters.minRating > 0) {
        processedShops = processedShops.filter(s => s.rating >= filters.minRating);
      }

      if (filters.openNow) {
        processedShops = processedShops.filter(s => s.isOpen);
      }

      if (filters.verifiedOnly) {
        processedShops = processedShops.filter(s => s.isVerified);
      }

      processedShops.sort((a, b) => {
        if (filters.sortBy === 'distance') return a.distance - b.distance;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });

      set({ shops: processedShops, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
