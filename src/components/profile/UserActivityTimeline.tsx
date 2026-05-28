import React from 'react';
import { ShoppingBag, Package, MessageSquare, CreditCard, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { UserActivity } from '../../modules/profile/profileStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface UserActivityTimelineProps {
  activities: UserActivity[];
}

const ICON_MAP: Record<UserActivity['type'], any> = {
  order: ShoppingBag,
  product: Package,
  review: MessageSquare,
  payment: CreditCard,
  security: ShieldCheck,
};

const COLOR_MAP: Record<UserActivity['type'], string> = {
  order: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10',
  product: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
  review: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/10',
  payment: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
  security: 'text-rose-500 border-rose-500/20 bg-rose-500/10',
};

export const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="flex flex-col gap-8 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Identity Ledger / Activity
           </h3>
           <button className="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Export Logs</button>
       </div>

       <div className="relative space-y-8 before:absolute before:inset-0 before:left-[19px] before:h-full before:w-px before:bg-white/5">
          {activities.map((activity, idx) => {
             const Icon = ICON_MAP[activity.type];
             const colors = COLOR_MAP[activity.type];

             return (
               <div key={activity.id} className="relative flex items-start gap-6 group">
                  {/* Timeline point */}
                  <div className={cn(
                     "relative z-10 w-10 h-10 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-110",
                     colors
                  )}>
                     <Icon className="w-5 h-5" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-4 rounded-2xl hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <p className="text-xs font-bold text-white uppercase tracking-tight">{activity.label}</p>
                           <span className="text-[8px] font-mono text-zinc-700">#{activity.id}</span>
                        </div>
                        {activity.metadata && (
                           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{activity.metadata}</p>
                        )}
                        <p className="text-[9px] text-zinc-600 mt-2 font-black uppercase">
                           {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                     </div>
                     <button className="self-end md:self-auto flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer group/btn">
                        Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
             );
          })}
       </div>

       <button className="w-full py-3 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
          Load Historic Activity Record
       </button>
    </div>
  );
};
