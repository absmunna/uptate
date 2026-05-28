import React from 'react';
import { QueryProvider } from './QueryProvider';
import { RouterProvider } from './RouterProvider';
import { ThemeProvider as FeatureThemeProvider } from '@/features/theme/ThemeContext';
import { LanguageProvider } from '@/features/language/LanguageContext';
import { AuthProvider } from '@/features/auth/AuthContext';
import { LocationProvider } from '@/features/location/LocationContext';
import { PKCoinProvider } from '@/features/wallet/PKCoinContext';
import { VideoUnlockProvider } from '@/features/digital-content/VideoUnlockContext';
import { WishlistProvider } from '@/features/wishlist/WishlistContext';
import { CartProvider } from '@/features/cart/CartContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SellerProvider } from '@/seller/SellerContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <FeatureThemeProvider>
      <LanguageProvider>
          <AuthProvider>
            <LocationProvider>
              <PKCoinProvider>
                <VideoUnlockProvider>
                  <WishlistProvider>
                    <CartProvider>
                      <TooltipProvider>
                        <SellerProvider>
                          <RouterProvider>
                            {children}
                          </RouterProvider>
                        </SellerProvider>
                      </TooltipProvider>
                    </CartProvider>
                  </WishlistProvider>
                </VideoUnlockProvider>
              </PKCoinProvider>
            </LocationProvider>
          </AuthProvider>
        </LanguageProvider>
      </FeatureThemeProvider>
  </QueryProvider>
);
