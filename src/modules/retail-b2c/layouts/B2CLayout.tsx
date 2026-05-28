import React from 'react';
import { ArrowLeft, Home, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore } from '../../../store';
import { useCartDrawerStore } from '../../cart/cartDrawerStore';

export const B2CLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-background mt-4">
      {/* Main Content Area */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};
