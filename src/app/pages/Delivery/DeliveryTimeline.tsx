import React from 'react';
import { DeliveryTimelineStep, DeliveryStatus } from './deliveryService';
import { 
  CheckCircle2, Circle, Package, Truck, 
  MapPin, CheckCircle, Smartphone, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const STATUS_ICONS: Record<DeliveryStatus, any> = {
  ORDER_PLACED: Zap,
  ORDER_CONFIRMED: CheckCircle2,
  PACKING: Package,
  SHIPPED: Truck,
  OUT_FOR_DELIVERY: Smartphone,
  DELIVERED: MapPin
};

export const DeliveryTimeline: React.FC<{ timeline: DeliveryTimelineStep[] }> = ({ timeline }) => {
  return (
    <div className="flex flex-col gap-0">
      {timeline.map((step, index) => {
        const Icon = STATUS_ICONS[step.status];
        const isLast = index === timeline.length - 1;
        const isActive = step.isCompleted && (!timeline[index + 1] || !timeline[index + 1].isCompleted);

        return (
          <div key={step.status} className="flex gap-6 min-h-[100px]">
            {/* Thread Line Area */}
            <div className="flex flex-col items-center shrink-0">
              <motion.div 
                initial={false}
                animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  step.isCompleted 
                    ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                    : "bg-zinc-900 text-zinc-600 border border-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              </motion.div>
              
              {!isLast && (
                <div className="w-0.5 flex-1 relative mt-2 bg-zinc-800">
                  {step.isCompleted && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="absolute top-0 w-full bg-cyan-400"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className={cn(
                "flex-1 pb-10 transition-all",
                isActive ? "opacity-100" : (step.isCompleted ? "opacity-60" : "opacity-30")
            )}>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">
                  {step.label}
                </h4>
                <span className="text-[10px] font-mono font-black text-zinc-500">
                  {step.timestamp}
                </span>
              </div>
              
              {step.message && (
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight leading-relaxed max-w-md">
                  {step.message}
                </p>
              )}

              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 inline-flex items-center gap-2"
                >
                  <CheckCircle className="w-3 h-3 text-cyan-400" />
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Active Verification Required</span>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
