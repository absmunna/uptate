import React from 'react';
import { User, Store, Building2, ShieldAlert, BadgeInfo, Eye } from 'lucide-react';
import { UserRole } from '../../modules/profile/profileStore';
import { cn } from '@/lib/utils';

interface RoleContextSwitcherProps {
  currentMode: UserRole;
  onSwitch: (mode: UserRole) => void;
}

const MODES: { value: UserRole; label: string; icon: any }[] = [
  { value: 'user', label: 'Buyer Aspect', icon: User },
  { value: 'seller', label: 'Merchant Aspect', icon: Store },
  { value: 'business', label: 'Enterprise Aspect', icon: Building2 },
];

export const RoleContextSwitcher: React.FC<RoleContextSwitcherProps> = ({ currentMode, onSwitch }) => {
  return (
    <div className="p-6 rounded-[32px] bg-zinc-900 border border-white/5 flex flex-col gap-4 select-none">
       <div className="flex items-center gap-2 mb-1">
          <Eye className="w-4 h-4 text-zinc-600" />
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-black">Identity Perspective</h3>
       </div>

       <div className="flex flex-col gap-2">
          {MODES.map((mode) => {
             const Icon = mode.icon;
             const isActive = currentMode === mode.value;

             return (
                <button
                   key={mode.value}
                   onClick={() => onSwitch(mode.value)}
                   className={cn(
                      "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all cursor-pointer group",
                      isActive ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/10" : "bg-black/20 text-zinc-500 hover:bg-white/5 hover:text-white"
                   )}
                >
                   <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-tighter">{mode.label}</span>
                   </div>
                   {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black/40" />}
                </button>
             );
          })}
       </div>

       <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-2.5">
          <BadgeInfo className="w-4 h-4 text-zinc-600 shrink-0" />
          <p className="text-[9px] text-zinc-500 leading-normal italic">
             Perspective switching allows you to audit how different clusters view your public identity profile.
          </p>
       </div>
    </div>
  );
};
