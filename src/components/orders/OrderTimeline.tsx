import React from 'react';
import { Check, Clock, Package, Truck, Home, CreditCard, Box, UserCheck, ShieldCheck } from 'lucide-react';
import { OrderState } from '../../modules/orders/orderTrackingStore';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  currentStatus: OrderState;
}

const STEPS: { id: OrderState; label: string; icon: any }[] = [
  { id: 'ORDER_CREATED', label: 'Placed', icon: Package },
  { id: 'PAYMENT_CONFIRMED', label: 'Escrow', icon: ShieldCheck },
  { id: 'PACKING', label: 'Packing', icon: Box },
  { id: 'PICKED_UP', label: 'Shipped', icon: Truck },
  { id: 'OUT_FOR_DELIVERY', label: 'Courier', icon: UserCheck },
  { id: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);
  // Special handling for intermediate states
  const effectiveIndex = currentIndex === -1 ? 
    (currentStatus === 'READY_FOR_PICKUP' ? 2.5 : 
     currentStatus === 'IN_TRANSIT' ? 3.5 : 
     currentStatus === 'COMPLETED' ? 5.5 : 0) : currentIndex;

  return (
    <div className="w-full select-none">
      {/* Desktop Horizontal View */}
      <div className="hidden md:flex items-center justify-between relative px-2 py-8">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--pm-border)] -translate-y-1/2 z-0" />
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-cyan-400 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
          style={{ width: `${(effectiveIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= effectiveIndex;
          const isActive = idx === Math.floor(effectiveIndex);
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted 
                    ? "bg-[#0b101d] border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                    : "bg-[#0b101d] border-[var(--pm-border)] text-[var(--pm-text-secondary)]"
                )}
              >
                {isCompleted && !isActive && idx < effectiveIndex ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap",
                isCompleted ? "text-cyan-400" : "text-[var(--pm-text-secondary)]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical View */}
      <div className="flex md:hidden flex-col gap-6 py-4">
         {STEPS.map((step, idx) => {
          const isCompleted = idx <= effectiveIndex;
          const isActive = idx === Math.floor(effectiveIndex);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex gap-4 items-start relative">
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className={cn(
                    "absolute left-5 top-10 w-0.5 h-6 z-0",
                    idx < effectiveIndex ? "bg-cyan-400" : "bg-[var(--pm-border)]"
                )} />
              )}
              
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 z-10",
                  isCompleted 
                    ? "bg-[#0b101d] border-cyan-400 text-cyan-400" 
                    : "bg-[#0b101d] border-[var(--pm-border)] text-[var(--pm-text-secondary)]"
                )}
              >
                 {isCompleted && !isActive && idx < effectiveIndex ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                )}
              </div>

              <div className="pt-1.5 flex-1">
                <h4 className={cn("text-xs font-black uppercase tracking-widest", isCompleted ? "text-white" : "text-[var(--pm-text-secondary)]")}>
                    {step.label}
                </h4>
                {isActive && (
                    <p className="text-[10px] text-cyan-400 font-bold mt-1">Status: {currentStatus.replace(/_/g, ' ')}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
