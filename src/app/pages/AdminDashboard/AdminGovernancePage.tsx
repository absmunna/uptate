import React, { useEffect } from 'react';
import { 
  ShieldAlert, UserCheck, FileText, Database, Activity, Terminal, 
  Siren, Radio, Lock, Gavel, Settings, Zap, LayoutDashboard,
  Search, Bell, Plus, MoreVertical, ShieldCheck, HeartPulse
} from 'lucide-react';
import { useAdminGovernanceStore } from '@/modules/admin/adminGovernanceStore';
import { adminGovernanceService } from '@/modules/admin/adminGovernanceService';
import { SystemHealthDashboard } from '@/components/admin/SystemHealthDashboard';
import { AuditLogStream } from '@/components/admin/AuditLogStream';
import { ModerationQueuePanel } from '@/components/admin/ModerationQueuePanel';
import { RiskAnalyticsPanel } from '@/components/admin/RiskAnalyticsPanel';
import { GovernanceLiveFeed } from '@/components/admin/GovernanceLiveFeed';
import { UserControlPanel } from '@/components/admin/UserControlPanel';
import { ContentControlPanel } from '@/components/admin/ContentControlPanel';
import { EscrowMonitoringPanel } from '@/components/admin/EscrowMonitoringPanel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminGovernancePage() {
  const { isLoading } = useAdminGovernanceStore();

  useEffect(() => {
    adminGovernanceService.init();
    adminGovernanceService.initEventListeners();
  }, []);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white">
      {/* Top Header Strip */}
      <div className="sticky top-0 z-[100] bg-[var(--pm-nav-bg)] backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                  <h2 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Admin Control</h2>
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1">Platform Governance Cluster v2.4</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Query system actors..." 
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-rose-500 outline-none transition-all"
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] border border-white/5 flex items-center justify-center relative hover:text-rose-400 transition-all cursor-pointer">
                 <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--pm-bg)]" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Governance Sidebar */}
          <div className="hidden lg:col-span-2 lg:flex flex-col gap-1 sticky top-24 h-fit">
             <NavItem icon={LayoutDashboard} label="Overview" active />
             <NavItem icon={UserCheck} label="Identity" />
             <NavItem icon={ShieldAlert} label="Moderation" count={3} />
             <NavItem icon={Activity} label="Risk Engine" />
             <NavItem icon={Landmark} label="Capital" />
             <NavItem icon={Database} label="System Data" />
             <NavItem icon={Terminal} label="Audit Logs" />
             <div className="h-px bg-white/5 my-4 mx-2" />
             <NavItem icon={Settings} label="Policies" />
             <NavItem icon={HeartPulse} label="Cluster Health" />
          </div>

          {/* CENTER: Core Governance Modules (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
             
             {/* System Status Banner */}
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-rose-500/10 via-[var(--pm-bg)] to-transparent border border-rose-500/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Security Ops Center</h1>
                        <p className="text-sm text-zinc-500 mt-2 uppercase font-bold tracking-tight max-w-sm">
                            Platform monitoring active. All administrative actions are recorded in the secondary audit plane.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Enforcement Live</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 uppercase">Last Refreshed: 0.04s ago</span>
                    </div>
                </div>
             </div>

             {/* 1. SYSTEM HEALTH OVERVIEW */}
             <SystemHealthDashboard />

             {/* 2. AUDIT LOG STREAM */}
             <AuditLogStream />

             {/* 3. MODERATION QUEUE */}
             <ModerationQueuePanel />

             {/* 4. IDENTITY & CONTENT SYSTEM */}
             <UserControlPanel />
             <ContentControlPanel />

             {/* 5. RISK & ANALYTICS */}
             <RiskAnalyticsPanel />

             {/* 6. ESCROW GOVERNANCE */}
             <EscrowMonitoringPanel />
          </div>

          {/* RIGHT: Live Feed & Anomalies (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
             <GovernanceLiveFeed />
             
             {/* Active Session Info */}
             <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col gap-4">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Admin Authority</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Super Admin</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Level 9 Clearances</p>
                    </div>
                </div>
             </div>

             {/* Policy Alerts */}
             <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col gap-4">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Active Policy Directives</h3>
                <div className="flex flex-col gap-3">
                    <PolicyAlert message="No crypto automated withdrawals permitted." />
                    <PolicyAlert message="KYC Verification mandatory for B2B portal." pulse />
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* MOBILE TABS NAVIGATION */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] h-[72px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
         <MobileTab icon={LayoutDashboard} active />
         <MobileTab icon={ShieldAlert} />
         <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Zap className="w-6 h-6" />
         </div>
         <MobileTab icon={Terminal} />
         <MobileTab icon={Settings} />
      </div>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, active = false, count = 0 }: any) => (
  <button className={cn(
    "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer",
    active ? "bg-white/5 border-l-2 border-rose-500" : "hover:bg-white/5 text-zinc-500 hover:text-white"
  )}>
    <div className="flex items-center gap-3">
        <Icon className={cn("w-4.5 h-4.5", active ? "text-rose-400" : "group-hover:text-rose-400")} />
        <span className={cn("text-xs font-bold uppercase tracking-widest tracking-tighter", active ? "text-white" : "text-inherit")}>{label}</span>
    </div>
    {count > 0 && (
        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">{count}</span>
    )}
  </button>
);

const PolicyAlert = ({ message, pulse = false }: any) => (
    <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
        <ShieldAlert className={cn("w-4 h-4 text-zinc-500 shrink-0 mt-0.5", pulse && "animate-pulse text-rose-500")} />
        <p className="text-[10px] text-zinc-400 leading-relaxed uppercase font-black tracking-tighter">
            {message}
        </p>
    </div>
);

const MobileTab = ({ icon: Icon, active = false }: any) => (
    <button className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-all",
        active ? "text-rose-400 bg-white/5" : "text-zinc-500"
    )}>
        <Icon className="w-6 h-6" />
    </button>
);

function Landmark(props: any) {
    return <Database {...props} />;
}
