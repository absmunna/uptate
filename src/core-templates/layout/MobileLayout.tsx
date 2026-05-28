import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { MobileMenu } from '../../components/navigation/MobileMenu';
import { MoreBottomSheet } from '../../components/navigation/MoreBottomSheet';

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="h-[100dvh] overflow-hidden bg-[var(--pm-bg)] flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <MoreBottomSheet isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
      <main className="flex-grow overflow-hidden relative pt-[60px] pb-[64px]">{children}</main>
      <BottomNav />
    </div>
  );
};
