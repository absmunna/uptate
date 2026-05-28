import React, { useState, useRef, useEffect } from 'react';
import { Palette, Globe, Check } from 'lucide-react';
import { useTheme } from '@/features/theme/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeLangSwitcher = () => {
  const { mode: theme, setMode: setTheme, presets: themePresets } = useTheme();
  const { lang, setLang } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/50 flex items-center justify-center text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:border-[var(--pm-accent)]/50 transition-all"
        title="Settings (Theme & Language)"
      >
        <Palette className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 glass border border-[var(--pm-border)]/50 rounded-2xl shadow-2xl z-50 p-3 flex flex-col gap-3"
          >
            {/* Theme Section */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">Themes</span>
              <div className="grid grid-cols-4 gap-2">
                {themePresets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="w-7 h-7 rounded-full border-2 relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[1]} 50%, ${t.swatch[2]} 100%)` }}
                    title={t.label}
                  >
                    {theme === t.id && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[var(--pm-border)]/30" />

            {/* Language Section */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">Language</span>
              <div className="flex bg-[var(--pm-bg)]/40 p-0.5 rounded-lg border border-[var(--pm-border)]/30">
                <button
                  onClick={() => setLang('BN')}
                  className={`flex-1 py-1 rounded-md text-[10px] font-black transition-all ${
                    lang === 'BN' 
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm' 
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  বাংলা (BN)
                </button>
                <button
                  onClick={() => setLang('EN')}
                  className={`flex-1 py-1 rounded-md text-[10px] font-black transition-all ${
                    lang === 'EN' 
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm' 
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
