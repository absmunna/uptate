import React from 'react';
import { ShoppingBag, Box, Plane, Sparkles, Package } from 'lucide-react';

export const PortalAccess = () => {
  const portals = [
    { name: 'শপ', icon: ShoppingBag },
    { name: 'সার্ভিস', icon: Sparkles },
    { name: 'রাইড', icon: Plane },
    { name: 'ওটিটি', icon: Box },
    { name: 'পাইকারি', icon: Package },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 px-4">
      {portals.map((p) => (
        <button key={p.name} className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] group-hover:border-[var(--pm-accent)] transition-all">
            <p.icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium text-[var(--pm-text-secondary)]">{p.name}</span>
        </button>
      ))}
    </div>
  );
};
