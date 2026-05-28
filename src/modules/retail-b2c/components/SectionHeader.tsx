import React from 'react';

export const SectionHeader = ({ title, showMore = false }: { title: string; showMore?: boolean }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-bold text-lg text-[var(--pm-text)]">{title}</h3>
    {showMore && <button className="text-xs font-bold text-[var(--pm-accent)]">সব দেখুন</button>}
  </div>
);
