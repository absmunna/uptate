import React from 'react';
import { X } from 'lucide-react';

export const MarqueeNotice = ({ message, onDismiss }: { message: string, onDismiss: () => void }) => (
  <div className="bg-[var(--pm-accent)] text-white p-2 px-4 flex justify-between items-center text-[10px] font-bold uppercase rounded-lg mb-4">
    <div className="animate-pulse">{message}</div>
    <button onClick={onDismiss}><X className="w-4 h-4" /></button>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-[var(--pm-surface)] p-4 rounded-xl border border-[var(--pm-border)] animate-pulse">
    <div className="h-32 bg-white/5 rounded-lg mb-3"></div>
    <div className="h-4 w-3/4 bg-white/5 rounded mb-2"></div>
    <div className="h-3 w-1/2 bg-white/5 rounded"></div>
  </div>
);
