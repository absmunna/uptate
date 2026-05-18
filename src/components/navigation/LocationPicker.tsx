import React, { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useLocationStore } from '../../modules/location/locationStore';
import { motion, AnimatePresence } from 'framer-motion';

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Gazipur'];

export const LocationPicker = () => {
  const { city, setLocation } = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--pm-bg)]/40 border border-[var(--pm-border)]/50 hover:border-[var(--pm-accent)]/50 transition-all group"
      >
        <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
        <span className="text-[10px] font-bold text-[var(--pm-text)] truncate max-w-[80px]">{city}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--pm-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-48 glass border border-[var(--pm-border)]/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 flex flex-col gap-1">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setLocation(c);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      city === c 
                      ? 'bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/20' 
                      : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-white/5'
                    }`}
                  >
                    {c}
                    {city === c && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
