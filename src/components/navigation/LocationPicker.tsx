import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Compass, Navigation } from 'lucide-react';
import { useLocation } from '@/features/location/LocationContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const commonCities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Gazipur'];

export const LocationPicker = () => {
  const { location, detect, setManual, isDetecting, displayName } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-10 rounded-2xl bg-zinc-900 border border-white/5 hover:border-cyan-400/30 transition-all group overflow-hidden"
      >
        <MapPin className={cn(
            "w-3.5 h-3.5 transition-colors",
            location.source === 'auto' ? "text-cyan-400" : "text-zinc-500"
        )} />
        <span className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[100px]">
            {isDetecting ? 'Scanning...' : (location.city || location.area || 'Set Location')}
        </span>
        <ChevronDown className={cn(
            "w-3 h-3 text-zinc-600 transition-transform duration-300",
            isOpen && "rotate-180"
        )} />
        
        {isDetecting && (
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-3 w-64 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl"
            >
              <div className="p-4 space-y-4">
                {/* Auto Detection Trigger */}
                <button
                    onClick={() => {
                        detect();
                        setIsOpen(false);
                    }}
                    className="w-full h-12 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center gap-2 text-cyan-400 hover:bg-cyan-400/20 transition-all group"
                >
                    <Navigation className="w-4 h-4 group-hover:animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Auto-Detect Node</span>
                </button>

                <div className="h-px bg-white/5" />

                {/* City Selection */}
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1 mb-2">Major Clusters</p>
                    <div className="grid grid-cols-1 gap-1">
                        {commonCities.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setManual(c, 'Bangladesh');
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    location.city === c 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {c}
                                {location.city === c && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
