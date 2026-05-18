import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-[var(--pm-surface)] rounded-xl shadow-sm border border-[var(--pm-border)] p-4 ${className}`}>
    {children}
  </div>
);
