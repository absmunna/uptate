import React from 'react';
import { ShieldCheck, Calendar, MapPin, MoreHorizontal, Camera } from 'lucide-react';
import { UserProfile, UserRole } from '../../modules/profile/profileStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProfileHeaderCardProps {
  profile: UserProfile;
}

const ROLE_CONFIG: Record<UserRole, { label: string; bg: string; text: string }> = {
  user: { label: 'Member', bg: 'bg-zinc-800', text: 'text-zinc-400' },
  seller: { label: 'Verified Seller', bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
  business: { label: 'Enterprise', bg: 'bg-amber-400/10', text: 'text-amber-400' },
  admin: { label: 'System Admin', bg: 'bg-rose-500/10', text: 'text-rose-500' },
  service_provider: { label: 'Service Hub', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
};

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ profile }) => {
  const role = ROLE_CONFIG[profile.role];

  return (
    <div className="relative overflow-hidden p-6 md:p-8 rounded-[32px] bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] flex flex-col items-center md:items-start text-center md:text-left gap-6 group">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
         <ShieldCheck className="w-32 h-32 text-cyan-400" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full">
         {/* Avatar Section */}
         <div className="relative group/avatar">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[var(--pm-bg)] overflow-hidden shadow-2xl relative z-10">
               <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
            <button className="absolute bottom-1 right-1 z-20 p-2 rounded-full bg-cyan-400 text-black shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer">
               <Camera className="w-4 h-4" />
            </button>
         </div>

         {/* Identity Meta */}
         <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
               <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {profile.name}
               </h1>
               <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 inline-flex items-center self-center md:self-auto",
                  role.bg, role.text
               )}>
                  {role.label}
               </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-2 gap-x-4">
               <div className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">User Since {format(new Date(profile.joinDate), 'MMM yyyy')}</span>
               </div>
               <div className="flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">Dhaka, Bangladesh</span>
               </div>
            </div>

            {/* Verification Badges Row */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-5">
               {profile.verificationLevels.map(v => (
                  <div key={v} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 group/v hover:border-cyan-400/30 transition-all cursor-pointer">
                     <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                     <span className="text-[9px] font-black uppercase text-zinc-400 group-hover/v:text-white transition-colors tracking-widest">{v} verified</span>
                  </div>
               ))}
               <button className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 transition-all cursor-pointer">
                   <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>
         </div>
         
         <div className="hidden lg:flex flex-col items-end gap-3">
            <button className="px-8 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-black uppercase tracking-widest shadow-xl shadow-cyan-400/20 active:scale-95 transition-all">
                Edit Identification
            </button>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Member ID: {profile.id}</p>
         </div>
      </div>
    </div>
  );
};
