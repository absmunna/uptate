import React from 'react';
import { Target, Navigation, Clock, Map as MapIcon, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface DeliveryMapPanelProps {
  eta: string;
  distance: string;
}

export const DeliveryMapPanel: React.FC<DeliveryMapPanelProps> = ({ eta, distance }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Live Map Preview (Mock) */}
      <div className="h-48 rounded-[32px] bg-[#0c0f17] border border-white/5 overflow-hidden relative shadow-inner">
        {/* Map Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Animated Route Line (Mock) */}
        <svg className="absolute inset-0 w-full h-full">
           <path 
              d="M 50 150 Q 150 50 250 100" 
              fill="none" 
              stroke="rgba(34,211,238,0.2)" 
              strokeWidth="4" 
              strokeDasharray="8 8"
           />
           <motion.path 
              d="M 50 150 Q 150 50 250 100" 
              fill="none" 
              stroke="#22d3ee" 
              strokeWidth="4" 
              strokeDasharray="8 8"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
           />
        </svg>

        {/* Markers */}
        <div className="absolute left-[45px] bottom-[40px] z-10">
            <div className="w-4 h-4 bg-zinc-800 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
            </div>
            <div className="absolute top-full mt-2 -left-4 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/5 text-[6px] font-black text-white/50 uppercase tracking-widest">Origin</div>
        </div>

        <div className="absolute right-[45px] top-[95px] z-10">
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center"
            >
                <div className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-black flex items-center justify-center text-black shadow-lg shadow-cyan-400/30">
                    <Navigation className="w-3 h-3 fill-black" />
                </div>
            </motion.div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-500">
                <MapIcon className="w-3 h-3" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-500">
                <Target className="w-3 h-3" />
            </button>
        </div>
      </div>

      {/* ETA Display */}
      <div className="p-6 rounded-[32px] bg-zinc-900 border border-white/5 relative overflow-hidden group">
         <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl transition-all group-hover:scale-150" />
         
         <div className="flex items-center gap-3 mb-6">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Arrival Analytics</span>
         </div>

         <div className="flex items-end justify-between gap-4">
            <div>
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic leading-none">Projected Windows</p>
               <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">~{eta}</h4>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic leading-none">Gap Remaining</p>
               <h4 className="text-md font-black text-cyan-400 italic tracking-tighter uppercase leading-none">{distance}</h4>
            </div>
         </div>

         <div className="mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight italic">Coordinate sync optimized for urban traffic density.</p>
         </div>
      </div>
      
      <div className="p-5 rounded-[24px] bg-white/5 border border-white/5 flex items-start gap-4">
         <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-1" />
         <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight leading-relaxed">
            Note: Global positioning data may have latency offsets. Real-time visual tracking is indicative of regional routing logic.
         </p>
      </div>
    </div>
  );
};
