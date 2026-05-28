import React from 'react';
import { DollarSign, Lock, Unlock, Gavel, ArrowUpRight, ShieldCheck, Landmark } from 'lucide-react';
import { formatBDT } from '@/lib/format';

export const EscrowMonitoringPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 w-full select-none">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-amber-400" /> Financial Escrow Oversight
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Audit Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Main Escrow Pool */}
                 <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Lock className="w-24 h-24 text-indigo-400 fill-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                         <Lock className="w-3.5 h-3.5" /> Locked Funds (Total)
                    </span>
                    <p className="text-3xl font-mono font-black text-white">{formatBDT(8542000)}</p>
                    <div className="mt-4 flex items-center gap-3">
                         <div className="flex flex-col">
                             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Daily Growth</span>
                             <span className="text-xs font-mono font-bold text-emerald-400">+1.2M BDT</span>
                         </div>
                         <div className="h-8 w-px bg-white/5" />
                         <div className="flex flex-col">
                             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Reserve Ratio</span>
                             <span className="text-xs font-mono font-bold text-white">99.8%</span>
                         </div>
                    </div>
                 </div>

                 {/* Release Status */}
                 <div className="flex flex-col gap-3">
                     <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Unlock className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Released (24h)</h4>
                                <p className="text-xs font-mono font-bold text-emerald-400">{formatBDT(1240000)}</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                     </div>

                     <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                                <Gavel className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">In Dispute Hub</h4>
                                <p className="text-xs font-mono font-bold text-rose-500">{formatBDT(84000)}</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-rose-500 transition-colors" />
                     </div>
                 </div>
            </div>

            <div className="mt-2 p-4 rounded-3xl bg-[var(--pm-surface)]/20 border border-[var(--pm-border)]">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dispute Case Volume</h4>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Last 30 Days</span>
                 </div>
                 <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-amber-400 w-[12%]" />
                 </div>
                 <p className="text-[9px] text-zinc-600 mt-3 font-bold uppercase tracking-tight">Only 12% of escrow funds are currently under official dispute review.</p>
            </div>
        </div>
    );
};
