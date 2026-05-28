import React from 'react';
import { DeliveryAgent } from './deliveryService';
import { Phone, Star, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const DeliveryAgentCard: React.FC<{ agent?: DeliveryAgent }> = ({ agent }) => {
  if (!agent) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-[32px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Logistics Unit</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-1">Verified Delivery Node</p>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-cyan-400/20 p-1 bg-zinc-900 shadow-xl">
          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover rounded-[20px]" />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{agent.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-black text-white">{agent.rating}</span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Global Rank</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
         <button className="h-12 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-white flex items-center justify-center gap-3 transition-all group">
            <Phone className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Call</span>
         </button>
         <button className="h-12 bg-zinc-900 rounded-2xl border border-white/5 text-zinc-500 hover:text-white flex items-center justify-center gap-3 transition-all">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
         </button>
      </div>

      <div className="pt-6 border-t border-white/5">
        <button className="w-full h-11 px-6 bg-cyan-400/5 hover:bg-cyan-400/10 rounded-xl flex items-center justify-between group transition-all">
           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest font-mono">Agent Performance Index</span>
           <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
