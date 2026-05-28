import React from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onChange: (qty: number) => void;
  isLoading?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  stock,
  onChange,
  isLoading = false,
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < stock) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-fit">
      <div 
        className={cn(
          "flex items-center justify-between border border-[var(--pm-border)] bg-[var(--pm-bg)]/40 rounded-xl h-10 w-28 overflow-hidden transition-all duration-200 select-none",
          isLoading && "opacity-80"
        )}
      >
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1 || isLoading}
          className="w-9 h-full flex items-center justify-center text-[var(--pm-text-secondary)] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer touch-target"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        
        <div className="flex-1 text-center flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--pm-accent)]" />
          ) : (
            <span className="font-mono text-sm font-extrabold text-[var(--pm-text)]">{quantity}</span>
          )}
        </div>

        <button
          onClick={handleIncrement}
          disabled={quantity >= stock || isLoading}
          className="w-9 h-full flex items-center justify-center text-[var(--pm-text-secondary)] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer touch-target"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
