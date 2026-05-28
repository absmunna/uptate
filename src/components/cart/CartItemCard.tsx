import React from 'react';
import { Trash2, AlertCircle, Coins } from 'lucide-react';
import { useCartStore, CartItem } from '../../modules/cart/cartStore';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/format';
import { toast } from 'sonner';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQtyChange = (newQty: number) => {
    updateQuantity(item.id, newQty);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(item.id);
    toast.success(`${item.name} removed from sourcing list`);
  };

  // Stock indicator computation
  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;

  return (
    <div className="relative p-4 flex flex-col md:flex-row gap-4 items-start md:items-center border border-[var(--pm-border)] bg-[var(--pm-surface)]/40 hover:bg-[var(--pm-surface)] hover:border-[var(--pm-accent)]/20 transition-all rounded-2xl overflow-hidden group">
      
      {/* Left: 1:1 aspect-ratio image (120x120px) + portal overlay + details */}
      <div className="flex gap-4 items-start w-full md:w-auto">
        <div className="w-[120px] h-[120px] shrink-0 bg-[var(--pm-bg)]/80 rounded-xl overflow-hidden border border-[var(--pm-border)] relative flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-[8px] font-black text-cyan-400 uppercase tracking-widest border border-white/5">
            {item.portal === 'b2b' ? 'B2B Lot' : item.portal === 'b2c' ? 'B2C' : item.portal === 'service' ? 'Service' : 'Logistics'}
          </span>
        </div>

        {/* Text Details (Title, Variant, Vendor) */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[var(--pm-accent)] truncate">
              {item.vendorName || 'Paikar Direct Seller'}
            </span>
            {item.variantInfo && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--pm-border)] shrink-0" />
                <span className="text-[10px] text-[var(--pm-text-secondary)] font-mono truncate max-w-[120px]">
                  {item.variantInfo}
                </span>
              </>
            )}
          </div>

          <h3 className="text-sm md:text-base font-medium text-[var(--pm-text)] tracking-tight line-clamp-2 leading-tight">
            {item.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-xs font-mono font-bold text-white/90 bg-white/5 px-2 py-0.5 rounded-md border border-[var(--pm-border)]">
              {formatBDT(item.price)} <span className="text-[9px] text-[var(--pm-text-secondary)] font-sans">/ unit</span>
            </span>
            {item.coinCashback && item.coinCashback > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                <Coins className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <span>+{item.coinCashback * item.quantity} Coins</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Center: Quantity selector + Stock and MOQ Status */}
      <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 md:items-center md:mx-auto pt-3 md:pt-0 border-t md:border-t-0 border-[var(--pm-border)]/40">
        <div className="flex items-center justify-between md:justify-center w-full">
          <span className="text-xs text-[var(--pm-text-secondary)] md:hidden">Quantity:</span>
          <QuantitySelector
            quantity={item.quantity}
            stock={item.stock}
            onChange={handleQtyChange}
          />
        </div>

        {/* Stock Status Label */}
        <div className="text-left md:text-center mt-1">
          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Only {item.stock} Left!
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-400 uppercase">
              ✓ In Stock
            </span>
          )}
          
          {/* MOQ Warn indication inside Card */}
          {item.moq && item.quantity < item.moq ? (
            <span className="text-[10px] font-bold text-orange-400 block mt-0.5 animate-pulse">
              MOQ of {item.moq} required for lot
            </span>
          ) : null}
        </div>
      </div>

      {/* Right: Dynamic price calculated + trash trigger */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--pm-border)]/40 shrink-0 self-stretch">
        <div className="text-left md:text-right">
          <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase block tracking-wider font-semibold">
            Subtotal
          </span>
          <span className="text-lg md:text-xl font-extrabold text-[#22d3ee] font-mono tracking-tight">
            {formatBDT(item.price * item.quantity)}
          </span>
        </div>

        {/* Delete Trigger */}
        <button
          onClick={handleRemove}
          className="h-10 w-10 rounded-xl bg-black/25 hover:bg-rose-500/10 text-[var(--pm-text-secondary)] hover:text-rose-400 transition-colors border border-[var(--pm-border)] flex items-center justify-center cursor-pointer touch-target"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
