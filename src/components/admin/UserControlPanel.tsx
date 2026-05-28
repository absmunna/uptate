import React from 'react';
import { UserX, ShieldBan, Eye, History, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UserControlPanel: React.FC = () => {
    // Read-only state view
    const stats = [
        { label: 'Active Users', value: '42.5k', color: 'text-emerald-400' },
        { label: 'Suspended', value: '182', color: 'text-rose-500' },
        { label: 'Verified Merchants', value: '8.4k', color: 'text-cyan-400' },
        { label: 'Shadow Banned', value: '24', color: 'text-zinc-600' }
    ];

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" /> Identity Governance
                </h3>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-[var(--pm-bg)]" />)}
                    </div>
                    <span className="text-[10px] font-black text-zinc-500">+12 Joined</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="p-3 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{s.label}</span>
                        <p className={`text-lg font-mono font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 overflow-hidden border border-white/5 rounded-3xl">
                <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Recent Identity Flags</h4>
                    <button className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter hover:underline">Auditor View</button>
                </div>
                <div className="p-2 flex flex-col gap-1">
                     {[
                        { name: 'User_9921', risk: 'High', action: 'Shadow Ban' },
                        { name: 'Merchant_Delta', risk: 'Medium', action: 'Identity Check' }
                     ].map((u, idx) => (
                        <div key={idx} className="p-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black">{u.name.charAt(0)}</div>
                                <div>
                                    <p className="text-xs font-bold text-white">{u.name}</p>
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">Risk Index: {u.risk}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                                <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all font-black text-[9px] uppercase px-3">Suspend</button>
                            </div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );
};
