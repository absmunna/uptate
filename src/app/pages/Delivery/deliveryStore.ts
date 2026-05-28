import { create } from 'zustand';
import { DeliveryPackage, deliveryService, DeliveryStatus } from './deliveryService';

interface DeliveryState {
  currentPackage: DeliveryPackage | null;
  isLoading: boolean;
  error: string | null;
  
  fetchTracking: (orderId: string) => Promise<void>;
  updateStatusLocally: (status: DeliveryStatus) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  currentPackage: null,
  isLoading: false,
  error: null,

  fetchTracking: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await deliveryService.getTrackingInfo(orderId);
      set({ currentPackage: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateStatusLocally: (status) => {
    set((state) => {
      if (!state.currentPackage) return state;
      
      const newTimeline = state.currentPackage.timeline.map(step => {
        if (step.status === status) {
          return { ...step, isCompleted: true, timestamp: new Date().toLocaleTimeString() };
        }
        return step;
      });

      return {
        currentPackage: {
          ...state.currentPackage,
          status,
          timeline: newTimeline
        }
      };
    });
  }
}));
