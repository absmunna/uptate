import React from 'react';
import { FileText, Flag, ShieldCheck, AlertCircle, Eye, Trash2, ListFilter } from 'lucide-react';

export const ContentControlPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> Content Governance
                </h3>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-zinc-500 uppercase cursor-pointer hover:text-white transition-colors">
                        <ListFilter className="w-3.5 h-3.5" /> Filter System
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase cursor-pointer">
                        Bulk Flag
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <ContentCard 
                    label="Social Feed Posts" 
                    count="12,840" 
                    flagged="42" 
                    trend="+12%"
                 />
                 <ContentCard 
                    label="Product Listings" 
                    count="42,100" 
                    flagged="12" 
                    trend="-4%"
                 />
                 <ContentCard 
                    label="B2B Sourcing Gigs" 
                    count="1,420" 
                    flagged="8" 
                    trend="+0.2%"
                 />
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Flag className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none">Global Filter Override</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-1.5">No active global bans in place.</p>
                    </div>
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Configure System Filters
                </button>
            </div>
        </div>
    );
};

const ContentCard = ({ label, count, flagged, trend }: any) => (
    <div className="p-5 rounded-3xl bg-black/20 border border-white/5 flex flex-col gap-4 group hover:border-white/10 transition-all">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
            <span className={trend.startsWith('+') ? 'text-rose-500' : 'text-emerald-400'}>{trend}</span>
        </div>
        <div>
            <p className="text-2xl font-mono font-black text-white">{count}</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                    {flagged} Flagged
                </span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Needs Review</span>
            </div>
        </div>
    </div>
);
