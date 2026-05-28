import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BackButtonProps {
  label?: string;
  className?: string;
  to?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  label = "পিছনে যান", 
  className = "", 
  to 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBack}
      className={`group flex items-center gap-1.5 text-[var(--pm-text-secondary)] hover:text-[var(--pm-accent)] transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-[var(--pm-accent)]/10 transition-colors">
        <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </div>
      {label && <span className="font-bold text-xs uppercase tracking-widest">{label}</span>}
    </motion.button>
  );
};
