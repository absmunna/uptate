import React from 'react';
import { Mail, Smartphone, Fingerprint, Briefcase, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { VerificationLevel } from '../../modules/profile/profileStore';
import { cn } from '@/lib/utils';

interface VerificationStatusCardProps {
  levels: VerificationLevel[];
}

const DATA: { id: VerificationLevel; label: string; icon: any; desc: string }[] = [
  { id: 'email', label: 'Communication Hub', icon: Mail, desc: 'Primary transactional reach' },
  { id: 'phone', label: 'Mobile Identity', icon: Smartphone, desc: 'Two-factor auth & SMS' },
  { id: 'nid', label: 'National Registry', icon: Fingerprint, desc: 'Government identity verified' },
  { id: 'business', label: 'Merchant License', icon: Briefcase, desc: 'Official trade authority' },
];

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ levels }) => {
  return (
    <div className="flex flex-col gap-6 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compliance & Verification
           </h3>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Level 3 reached</span>
       </div>

       <div className="flex flex-col gap-3">
          {DATA.map((item) => {
             const isVerified = levels.includes(item.id);
             const Icon = item.icon;

             return (
                <div key={item.id} className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center border",
                         isVerified ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5" : "bg-zinc-800 border-white/5 text-zinc-600"
                      )}>
                         <Icon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white uppercase tracking-tight leading-none mb-1">{item.label}</p>
                         <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">{item.desc}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      {isVerified ? (
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest flex items-center gap-1.5">
                               <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                            </span>
                            <span className="text-[8px] text-zinc-700 font-bold uppercase">Audit ID: {Math.random().toString(36).substr(2, 6)}</span>
                         </div>
                      ) : (
                         <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-400 hover:text-black text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all cursor-pointer">
                            Verify Now
                         </button>
                      )}
                      <button className="p-1 px-2 rounded-lg hover:bg-white/5 text-zinc-700 transition-colors">
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             );
          })}
       </div>

       <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-snug">
             Higher verification levels unlock premium merchant features, increased payout limits, and priority dispute handling.
          </p>
       </div>
    </div>
  );
};
