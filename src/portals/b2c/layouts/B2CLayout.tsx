import React from 'react';

export const B2CLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)]">
      <header className="fixed top-0 w-full z-40 glass h-[60px] border-b border-[var(--pm-border)] flex items-center px-4">
        <h1 className="font-bold text-lg text-[var(--pm-accent)]">Paikar B2C Shop</h1>
      </header>
      <main className="pt-[60px] pb-[80px]">
        {children}
      </main>
    </div>
  );
};
