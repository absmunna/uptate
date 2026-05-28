import { api } from "@/lib/api";

export interface Shop {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distance: number; // KM
  deliveryTime: string;
  activeProductsCount: number;
  isVerified: boolean;
  isOpen: boolean;
  category: string;
  lat: number;
  lng: number;
  address: string;
}

export const nearbyShopService = {
  getNearbyShops: async (params: {
    lat: number;
    lng: number;
    radius: number;
    category?: string;
  }): Promise<Shop[]> => {
    try {
      const response = await api.get<{ data: Shop[] }>('/api/v1/nearby', {
        params: {
          lat: params.lat,
          lng: params.lng,
          radius: params.radius,
          category: params.category
        }
      });
      return response.data;
    } catch (error) {
      console.error("[nearbyShopService] Failed to fetch shops:", error);
      throw new Error("Could not connect to locality scanning nodes. Signal weak.");
    }
  }
};
