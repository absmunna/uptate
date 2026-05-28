import { lazy } from 'react';

export type UserRole = 'buyer' | 'guest' | 'user' | 'seller' | 'business' | 'admin' | 'service_provider' | 'moderator';

export interface RouteItem {
  path: string;
  component: any;
  roles: UserRole[];
  isPublic?: boolean;
}

// Public Pages
const Home = lazy(() => import('../../pages/home'));
const MarketplaceHome = lazy(() => import('../../portals/marketplace/pages/MarketplaceHome').then(m => ({ default: m.MarketplaceHome })));
const MarketplaceSearch = lazy(() => import('../../portals/marketplace/pages/MarketplaceSearch').then(m => ({ default: m.MarketplaceSearchPage })));
const MarketplaceCategory = lazy(() => import('../../portals/marketplace/pages/MarketplaceCategory').then(m => ({ default: m.MarketplaceCategoryPage })));
const MarketplaceStore = lazy(() => import('../../portals/marketplace/pages/MarketplaceStore').then(m => ({ default: m.MarketplaceStorePage })));
const ProductDetail = lazy(() => import('../../pages/product-detail'));
const Vendors = lazy(() => import('../../pages/vendors'));
const VendorDetail = lazy(() => import('../../pages/vendor-detail'));
const Categories = lazy(() => import('../../pages/categories'));
const Local = lazy(() => import('../pages/NearByShop/NearByShopPage'));
const Tracking = lazy(() => import('../pages/Delivery/DeliveryTrackingPage'));
const Reels = lazy(() => import('../../pages/reels'));
const Demand = lazy(() => import('../../pages/demand'));
const Search = lazy(() => import('../../pages/search'));

// Service Portals
const Services = lazy(() => import('../../pages/services'));
const Transport = lazy(() => import('../../pages/transport'));
const DigitalServices = lazy(() => import('../../pages/digital-services'));
const Travel = lazy(() => import('../../pages/travel'));
const Portals = lazy(() => import('../../pages/portals'));
const PKStore = lazy(() => import('../../portals/pk-store/pages/PKStoreHome').then(m => ({ default: m.PKStoreHome })));
const Dropship = lazy(() => import('../../portals/dropship/pages/DropshipHome'));
const News = lazy(() => import('../../portals/news/pages/NewsHome').then(m => ({ default: m.NewsHome })));
const ChatList = lazy(() => import('../../modules/chat/pages/ChatList').then(m => ({ default: m.ChatList })));
const ChatDetail = lazy(() => import('../../modules/chat/pages/ChatDetail').then(m => ({ default: m.ChatDetail })));
const B2C = lazy(() => import('../../modules/retail-b2c/pages/B2CHome').then(m => ({ default: m.B2CHome })));
const B2B = lazy(() => import('../../pages/b2b/index'));

// Auth
const Login = lazy(() => import('../../pages/auth/login'));
const Register = lazy(() => import('../../pages/auth/register'));
const ForgotPassword = lazy(() => import('../../pages/auth/forgot-password'));

// Private / Identity
const Profile = lazy(() => import('../pages/Profile/ProfilePage'));
const Cart = lazy(() => import('../../pages/cart'));
const Checkout = lazy(() => import('../../pages/checkout').then(m => ({ default: m.CheckoutPage })));
const Orders = lazy(() => import('../pages/OrderTracking/OrderTrackingPage'));
const Wallet = lazy(() => import('../../portals/wallet/pages/WalletDashboard').then(m => ({ default: m.WalletDashboard })));
const Notifications = lazy(() => import('../../pages/notifications'));

// Seller
const SellerDashboard = lazy(() => import('../../pages/seller/dashboard'));

// Admin
const AdminGovernance = lazy(() => import('../pages/AdminDashboard/AdminGovernancePage'));

export const ROUTES: RouteItem[] = [
  { path: '/', component: Home, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace', component: MarketplaceHome, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/search', component: MarketplaceSearch, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/category/:slug', component: MarketplaceCategory, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/store/:id', component: MarketplaceStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/product/:id', component: ProductDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/vendors', component: Vendors, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/vendors/:id', component: VendorDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/categories', component: Categories, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/local', component: Local, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/reels', component: Reels, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/demand', component: Demand, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/search', component: Search, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/pk-store', component: PKStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/dropship', component: Dropship, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/news', component: News, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/messages', component: ChatList, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/messages/:conversationId', component: ChatDetail, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/retail', component: B2C, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/b2c', component: B2C, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/b2b', component: B2B, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/services', component: Services, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/transport', component: Transport, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/digital-services', component: DigitalServices, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/travel', component: Travel, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/portals', component: Portals, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  { path: '/auth/login', component: Login, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/register', component: Register, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/forgot-password', component: ForgotPassword, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  { path: '/profile', component: Profile, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/cart', component: Cart, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/checkout', component: Checkout, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/orders', component: Orders, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/orders/track/:orderId', component: Tracking, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/wallet', component: Wallet, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/notifications', component: Notifications, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  
  { path: '/seller/*', component: SellerDashboard, roles: ['seller', 'business', 'admin'] },
  { path: '/admin/*', component: AdminGovernance, roles: ['admin'] },
];
