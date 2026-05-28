import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { Navbar } from '../../components/navigation/Navbar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { MobileMenu } from '../../components/navigation/MobileMenu';
import { MoreBottomSheet } from '../../components/navigation/MoreBottomSheet';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) setMoreOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    if (moreOpen) setMenuOpen(false);
  }, [moreOpen]);

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleMoreClick = () => {
    setMoreOpen(true);
  };

  return (
    <div className="flex bg-[var(--pm-bg)] min-h-screen">
      <div className="hidden md:block w-[240px] shrink-0">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <Navbar onMenuClick={handleMenuClick} />
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <MoreBottomSheet isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
        <BottomNav />
      </div>
      <main className="flex-grow p-4 md:p-8 pt-[80px] md:pt-8 md:ml-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
