import { useSellerDashboardStore, SellerKPI, SellerProduct, SellerOrder, SellerAIInsight } from './sellerDashboardStore';

const MOCK_PRODUCTS: SellerProduct[] = [
  { id: 'p1', title: 'Premium Cotton Panjabi', price: 2450, image: 'https://images.unsplash.com/photo-1597983073492-bc240182d1c6?auto=format&fit=crop&q=80&w=200', stock: 45, views: 1240, sales: 88, conversion: 7.1, isBoosted: true, status: 'active' },
  { id: 'p2', title: 'Silk Saree - Handloom', price: 8500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200', stock: 12, views: 850, sales: 14, conversion: 1.6, isBoosted: false, status: 'active' },
  { id: 'p3', title: 'Casual Denim Jacket', price: 3200, image: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6a?auto=format&fit=crop&q=80&w=200', stock: 0, views: 640, sales: 42, conversion: 6.5, isBoosted: false, status: 'out_of_stock' },
];

const MOCK_ORDERS: SellerOrder[] = [
  { id: 'ORD-8821', buyerName: 'Karim Ahmed', amount: 4900, status: 'new', createdAt: new Date().toISOString(), itemCount: 2 },
  { id: 'ORD-8819', buyerName: 'Sufia Begum', amount: 8500, status: 'processing', createdAt: new Date(Date.now() - 86400000).toISOString(), itemCount: 1 },
];

const MOCK_INSIGHTS: SellerAIInsight[] = [
  { id: 'i1', type: 'trending', message: 'Your "Premium Cotton Panjabi" is trending in the Social Feed.', ctaLabel: 'Boost Now', ctaAction: 'boost' },
  { id: 'i2', type: 'price_demand', message: 'Demand for Denim Jackets is up 40%. Consider restocking.', ctaLabel: 'View Demand', ctaAction: 'inventory' },
];

export const sellerDashboardService = {
  /**
   * Initialize dummy data for the dashboard shell
   */
  init: () => {
    const store = useSellerDashboardStore.getState();
    store.setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      store.setKPIs({
        totalSales: 124500,
        totalOrders: 420,
        conversionRate: 4.8,
        pendingOrders: 12,
        refundRate: 1.2,
        stockAlerts: 3,
      });
      store.setProducts(MOCK_PRODUCTS);
      store.setOrders(MOCK_ORDERS);
      store.setInsights(MOCK_INSIGHTS);
      store.setLoading(false);
    }, 800);
  },

  /**
   * Real-time listeners for the seller lifecycle
   */
  initEventListeners: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('ORDER_CREATED', (e: any) => {
      // In a real app, we might fetch the latest order info or rely on the payload
      const store = useSellerDashboardStore.getState();
      const newOrder: SellerOrder = {
        id: e.detail.orderId,
        buyerName: "Marketplace Buyer",
        amount: e.detail.total,
        status: 'new',
        createdAt: new Date().toISOString(),
        itemCount: 1
      };
      
      store.setOrders([newOrder, ...store.orders]);
      store.setKPIs({
        ...store.kpis,
        totalOrders: store.kpis.totalOrders + 1,
        pendingOrders: store.kpis.pendingOrders + 1
      });
    });

    window.addEventListener('STOCK_UPDATED', (e: any) => {
      const { productId, newStock } = e.detail;
      const store = useSellerDashboardStore.getState();
      store.updateProduct(productId, { stock: newStock });
    });
  },

  acceptOrder: (orderId: string) => {
    const store = useSellerDashboardStore.getState();
    store.updateOrder(orderId, 'processing');
  },

  shipOrder: (orderId: string) => {
    const store = useSellerDashboardStore.getState();
    store.updateOrder(orderId, 'shipped');
  }
};
