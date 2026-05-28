import { api } from "@/lib/api";

export type DeliveryStatus = 
  | 'ORDER_PLACED' 
  | 'ORDER_CONFIRMED' 
  | 'PACKING' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED';

export interface DeliveryTimelineStep {
  status: DeliveryStatus;
  label: string;
  timestamp: string;
  isCompleted: boolean;
  message?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  currentLat: number;
  currentLng: number;
}

export interface DeliveryPackage {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  productName: string;
  productImage: string;
  sellerName: string;
  totalAmount: number;
  eta: string;
  distanceRemaining: string;
  timeline: DeliveryTimelineStep[];
  agent?: DeliveryAgent;
}

export const deliveryService = {
  getTrackingInfo: async (orderId: string): Promise<DeliveryPackage> => {
    try {
      const response = await api.get<{ data: DeliveryPackage }>(`/api/v1/delivery/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("[deliveryService] Failed to fetch tracking:", error);
      throw new Error("Logistics telemetry feed unavailable. Order identification mismatch.");
    }
  }
};
