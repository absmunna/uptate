export type MarketplacePortalType = 
  | 'all' 
  | 'retail' 
  | 'b2b' 
  | 'nearby' 
  | 'services' 
  | 'pk-shop' 
  | 'transport' 
  | 'travel' 
  | 'demand' 
  | 'brands';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  portal: MarketplacePortalType;
  storeName: string;
  storeId: string;
  isVerified?: boolean;
}

export interface MarketplaceStore {
  id: string;
  name: string;
  logo: string;
  rating: number;
  isVerified: boolean;
  type: 'factory' | 'supplier' | 'retail' | 'nearby' | 'service-provider' | 'brand';
  portal: MarketplacePortalType;
}
