import React from 'react';
import { DeliveryPackage } from './deliveryService';
import { formatBDT } from '@/lib/format';
import { Package, ShieldCheck, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export const OrderSummaryCard: React.FC<{ pkg: DeliveryPackage }> = ({ pkg }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-[32px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Order Digest</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-1">ID: {pkg.orderId}</p>
        </div>
      </div>

      <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-800 border border-white/5 mb-6 group relative">
        <img 
          src={pkg.productImage} 
          alt={pkg.productName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <button className="w-full h-10 bg-white/10 backdrop-blur-md rounded-xl text-[8px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
              <ExternalLink className="w-3 h-3" />
              View Asset
           </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Entity Label</h4>
          <p className="text-sm font-black text-white tracking-tighter italic uppercase">{pkg.productName}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Vested Settlement</h4>
            <p className="text-sm font-black text-cyan-400 tracking-tighter italic">{formatBDT(pkg.totalAmount)}</p>
          </div>
          <div className="text-right">
            <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status Code</h4>
            <div className="flex items-center gap-1 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase">Paid</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-800/30 border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
               <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Security Mask</p>
               <p className="text-[10px] font-bold text-white tracking-tight mt-1 italic">PaikarSecure Verified</p>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
         </div>
      </div>
    </motion.div>
  );
};
