import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { safeStorage } from "@/utils/storage";
import { 
  LayoutDashboard, ShoppingBag, BarChart2, Users, Settings, 
  CreditCard, History, User, Rss, LogOut, Globe, ShieldCheck, ShoppingCart, MessageSquare,
  Play, Factory
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    safeStorage.removeItem('accessToken');
    safeStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const getRoleBadge = (role?: string) => {
    if (role === 'admin' || role === 'super_admin') return 'অ্যাডমিন';
    if (role === 'seller') return 'বিক্রেতা';
    if (role === 'moderator') return 'মডারেটর';
    return 'গ্রাহক';
  };

  const sellerItems = [
    { name: 'ড্যাশবোর্ড ওভারভিউ', path: '/dashboard', icon: LayoutDashboard },
    { name: 'বিক্রয় ও পণ্য ম্যানেজ করুন', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'অর্ডার সমূহ', path: '/dashboard/orders', icon: History },
    { name: 'ওয়ালেট', path: '/wallet', icon: CreditCard },
  ];

  const buyerItems = [
    { name: 'হোম ফিড', path: '/', icon: Globe },
    { name: 'সোশ্যাল ফিড', path: '/feed', icon: Rss },
    { name: 'পাইকারমার্ট শর্টস', path: '/reels', icon: Play },
    { name: 'গ্লোবাল রপ্তানি বাজার', path: '/export', icon: Factory },
    { name: 'আমার কার্ট', path: '/cart', icon: ShoppingCart },
    { name: 'অর্ডার হিস্ট্রি', path: '/orders', icon: History },
    { name: 'ব্যক্তিগত প্রোফাইল', path: '/profile', icon: User },
    { name: 'আমার ওয়ালেট', path: '/wallet', icon: CreditCard },
  ];

  const adminItems = [
    { name: 'অ্যাডমিন প্যানেল', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'গ্রাহক ও বিক্রেতা', path: '/dashboard/admin/users', icon: Users },
    { name: 'পণ্য ভেরিফিকেশন', path: '/dashboard/admin/products', icon: ShieldCheck },
    { name: 'লেনদেন হিস্ট্রি', path: '/dashboard/admin/transactions', icon: CreditCard },
    { name: 'সিস্টেম সেটিংস', path: '/dashboard/admin/settings', icon: Settings },
  ];

  const getNavItems = () => {
    if (!user) return buyerItems; // fallback
    const userRole = user.role as string;
    if (userRole === 'admin' || userRole === 'super_admin') return adminItems;
    if (userRole === 'seller') return sellerItems;
    return buyerItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[var(--pm-surface)] border-r border-[var(--pm-border)] h-screen fixed left-0 top-16 p-4 hidden md:flex flex-col justify-between">
      <div className="space-y-6">
        {/* User Info Card inside Sidebar */}
        {user && (
          <div className="p-3 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--pm-accent)]/10 flex items-center justify-center text-[var(--pm-accent)] font-bold text-lg border border-[var(--pm-border)]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">{user.name || 'ব্যবহারকারী'}</h4>
              <span className="text-[10px] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold px-2 py-0.5 rounded-full inline-block border border-[var(--pm-accent)]/10">
                {getRoleBadge(user.role)}
              </span>
            </div>
          </div>
        )}

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive 
                    ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/10' 
                    : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="pt-4 border-t border-[var(--pm-border)]">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 font-semibold text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      )}
    </aside>
  );
};
