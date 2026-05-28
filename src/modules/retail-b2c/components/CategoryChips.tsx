import React from 'react';

export const CategoryChips = () => {
  const categories = ['ফ্যাশন', 'ইলেকট্রনিক্স', 'গ্রোসারি', 'গৃহস্থালি', 'সৌন্দর্য'];
  
  return (
    <div className="flex gap-2 overflow-x-auto px-4 hide-scrollbar">
      {categories.map((c) => (
        <button key={c} className="px-4 py-1.5 rounded-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-sm font-medium text-[var(--pm-text-secondary)] whitespace-nowrap hover:bg-[var(--pm-accent)] hover:text-white transition-all">
          {c}
        </button>
      ))}
    </div>
  );
};
