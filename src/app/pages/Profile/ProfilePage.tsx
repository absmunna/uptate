import React, { useEffect, memo } from 'react';
import { 
  User, Shield, Search, Bell, Settings, ArrowRight,
  ShoppingBag, Package, MessageSquare, History,
  Lock, Wallet, UserCheck, LayoutDashboard,
  Box, Eye, Zap, Sparkles
} from 'lucide-react';
import { useProfileStore } from '@/modules/profile/profileStore';
import { profileService } from '@/modules/profile/profileService';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { TrustScoreCard } from '@/components/profile/TrustScoreCard';
import { UserActivityTimeline } from '@/components/profile/UserActivityTimeline';
import { ReputationPanel } from '@/components/profile/ReputationPanel';
import { RoleContextSwitcher } from '@/components/profile/RoleContextSwitcher';
import { IdentityInsightsPanel } from '@/components/profile/IdentityInsightsPanel';
import { VerificationStatusCard } from '@/components/profile/VerificationStatusCard';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { profile, viewMode, isLoading } = useProfileStore();

  useEffect(() => {
    profileService.init();
    profileService.initEventListeners();
  }, []);

  if (isLoading && !profile) {
    return (
        <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white">
      {/* Top Header Strip */}
      <div className="sticky top-0 z-[100] bg-[var(--pm-nav-bg)] backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-cyan-400 select-none">
                 <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Identity Hub</h2>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Universal Pulse Search..." 
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-cyan-400 outline-none transition-all"
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] border border-white/5 flex items-center justify-center relative hover:text-cyan-400 transition-all cursor-pointer">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--pm-bg)]" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Identity Navigation Sidebar */}
          <div className="hidden lg:col-span-2 lg:flex flex-col gap-1 sticky top-24 h-fit">
             <NavItem icon={LayoutDashboard} label="Overview" active />
             <NavItem icon={ShoppingBag} label="Orders" />
             <NavItem icon={Box} label="Storefront" />
             <NavItem icon={History} label="Activity Ledger" />
             <NavItem icon={MessageSquare} label="Reputation" />
             <div className="h-px bg-white/5 my-4 mx-2" />
             <NavItem icon={Wallet} label="Financials" />
             <NavItem icon={Lock} label="Security Core" />
             <NavItem icon={Settings} label="Preferences" />
             
             <div className="mt-8">
                <RoleContextSwitcher currentMode={viewMode} onSwitch={profileService.switchViewMode} />
             </div>
          </div>

          {/* CENTER: Profile Core (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
             
             {/* 1. PROFILE HEADER */}
             <ProfileHeaderCard profile={profile} />

             {/* 2. REPUTATION & TRUST */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ReputationPanel reputation={profile.reputation} />
                <TrustScoreCard score={profile.trustScore} />
             </div>

             {/* 3. VERIFICATION SYSTEM */}
             <VerificationStatusCard levels={profile.verificationLevels} />

             {/* 4. ACTIVITY TIMELINE */}
             <UserActivityTimeline activities={profile.activities} />
             
             {/* Security Footer */}
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 via-[var(--pm-bg)] to-transparent border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none italic">Encrypted Profile Plane</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-1.5">Identity data handled via zero-knowledge proof protocols.</p>
                    </div>
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer">
                    Request Data Export
                </button>
             </div>
          </div>

          {/* RIGHT: AI Insights & Alerts (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
             <IdentityInsightsPanel />
             
             {/* Performance Summary widget */}
             <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                      <Zap className="w-4 h-4 text-cyan-400" />
                   </div>
                   <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-black">Cluster Participation</h3>
                </div>
                <div className="space-y-4">
                   <MetricRow label="Node Reliability" value="99.2%" />
                   <MetricRow label="Signal Strength" value="Elite" />
                   <MetricRow label="Governance Weight" value="0.14 Units" />
                </div>
             </div>

             {/* User Bio / Micro */}
             <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col gap-3">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Identity Bio</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed uppercase font-bold tracking-tight">
                   Multi-vendor retail specialist based in Dhaka. Focused on high-quality apparel sourcing and B2B bridge management.
                </p>
                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5">
                   {['Retail', 'Focal Point', 'Mod'].map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 text-[8px] font-black text-zinc-500 uppercase">{tag}</span>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* MOBILE TABS NAVIGATION */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] h-[72px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
         <MobileTab icon={LayoutDashboard} active />
         <MobileTab icon={History} />
         <div className="w-14 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-cyan-400/20">
            <User className="w-6 h-6" />
         </div>
         <MobileTab icon={MessageSquare} />
         <MobileTab icon={Settings} />
      </div>
    </div>
  );
}

const NavItem = memo(({ icon: Icon, label, active = false, count = 0 }: any) => (
  <button className={cn(
    "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer",
    active ? "bg-white/5 border-l-2 border-cyan-400" : "hover:bg-white/5 text-zinc-500 hover:text-white"
  )}>
    <div className="flex items-center gap-3">
        <Icon className={cn("w-4.5 h-4.5", active ? "text-cyan-400" : "group-hover:text-cyan-400")} />
        <span className={cn("text-xs font-bold uppercase tracking-widest tracking-tighter", active ? "text-white" : "text-inherit")}>{label}</span>
    </div>
    {count > 0 && (
        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">{count}</span>
    )}
  </button>
));

const MetricRow = memo(({ label, value }: any) => (
    <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">{label}</span>
        <span className="text-[10px] font-mono font-black text-white uppercase">{value}</span>
    </div>
));

const MobileTab = memo(({ icon: Icon, active = false }: any) => (
    <button className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-all",
        active ? "text-cyan-400 bg-white/5" : "text-zinc-500"
    )}>
        <Icon className="w-6 h-6" />
    </button>
));
