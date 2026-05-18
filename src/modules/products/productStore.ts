import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  images?: string[];
  coinCashback?: number;
  tag?: string;
  portal: 'pk-store' | 'b2c' | 'b2b';
  description?: string;
  stock?: number;
  isPKStore?: boolean;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: any) => Promise<void>;
  addProduct: (productData: any) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      // Map backend fields to frontend store format if necessary
      const mappedProducts = response.data.map((p: any) => ({
        ...p,
        portal: p.isPKStore ? 'pk-store' : 'b2c', // Example mapping
        image: p.images?.[0] || 'https://via.placeholder.com/300',
        price: Number(p.price),
        originalPrice: Number(p.originalPrice)
      }));
      set({ products: mappedProducts, isLoading: false });
    } catch (err: any) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      // In a real app, you might need an auth token here
      const response = await axios.post(`${API_BASE_URL}/products`, {
        ...productData,
        isPKStore: productData.portal === 'pk-store',
        images: [productData.image],
        description: productData.description || productData.name,
      });
      
      const newProduct = {
        ...response.data,
        portal: response.data.isPKStore ? 'pk-store' : 'b2c',
        image: response.data.images?.[0]
      };

      set((state) => ({ 
        products: [newProduct, ...state.products],
        isLoading: false 
      }));
    } catch (err) {
      set({ error: 'Failed to add product', isLoading: false });
      throw err;
    }
  },

  removeProduct: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (err) {
      set({ error: 'Failed to delete product' });
    }
  }
}));
