import React from 'react';
import { Search, Bell, Heart, ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart/cartStore';

export const MarketplaceHeader = () => {
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-[110] w-full bg-[var(--pm-nav-bg)] backdrop-blur-xl border-b border-[var(--pm-border)]">
      <div className="max-w-[1440px] mx-auto px-4 h-[60px] md:h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/marketplace" className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="hidden sm:block text-lg md:text-xl font-black italic uppercase tracking-tighter text-white">
            Marketplace
          </span>
        </Link>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl mx-auto hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search products, suppliers, stores, services..."
              className="w-full bg-[var(--pm-surface)]/50 border border-[var(--pm-border)] rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400 transition-all text-white"
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/marketplace/search?q=${(e.target as HTMLInputElement).value}`)}
            />
          </div>
        </div>

        {/* Mobile Search Trigger */}
        <button className="md:hidden p-2 text-zinc-400 hover:text-white" onClick={() => navigate('/marketplace/search')}>
          <Search className="w-6 h-6" />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2 text-zinc-400 hover:text-white relative transition-colors">
            <Heart className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--pm-bg)]" />
          </button>
          
          <button className="p-2 text-zinc-400 hover:text-white relative transition-colors" onClick={() => navigate('/notifications')}>
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--pm-bg)]" />
          </button>

          <button className="p-2 text-zinc-400 hover:text-white relative transition-colors" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-cyan-400 text-[10px] font-black text-black flex items-center justify-center border border-[var(--pm-bg)]">
                {cartItemCount}
              </span>
            )}
          </button>

          <button className="md:hidden p-2 text-zinc-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
