import React from 'react';
import { motion } from 'motion/react';

export const HomeHero = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative mx-4 mt-4 h-48 rounded-[24px] overflow-hidden bg-gradient-to-r from-[var(--pm-accent)] to-[#f97316] flex items-center p-6 shadow-lg"
    >
      <div className="text-white z-10 w-2/3">
        <h2 className="text-2xl font-bold mb-2">এই সপ্তাহের সেরা ডিল!</h2>
        <p className="text-sm opacity-90">৫০% পর্যন্ত ছাড় উপভোগ করুন সব লাইফস্টাইল পণ্যে।</p>
        <button className="mt-4 px-4 py-2 bg-white text-[var(--pm-accent)] rounded-full text-sm font-bold">
          এখনই কিনুন
        </button>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/20 backdrop-blur-sm -mr-10 rotate-12 rounded-l-full" />
    </motion.div>
  );
};
