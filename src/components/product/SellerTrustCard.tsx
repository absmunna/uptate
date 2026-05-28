import React from 'react';
import { BadgeCheck, ArrowRight, MessageSquare, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface SellerTrustCardProps {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  isTopRated?: boolean;
  responseRate?: string;
  followersCount?: number;
}

export const SellerTrustCard: React.FC<SellerTrustCardProps> = ({
  name,
  avatar,
  isVerified = true,
  isTopRated = true,
  responseRate = "99%",
  followersCount = 14850,
}) => {
  const handleContact = () => {
    toast.success(`Direct message interface opened with ${name}`);
  };

  return (
    <Card className="p-5 border border-[var(--pm-border)] bg-[var(--pm-surface)] rounded-2xl">
      <div className="flex flex-col gap-4">
        {/* Profile Row */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--pm-glass)] overflow-hidden border border-[var(--pm-border)] flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl font-bold text-[var(--pm-accent)]">{name.charAt(0)}</span>
              )}
            </div>
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-cyan-400 text-black rounded-full p-0.5 border-2 border-[var(--pm-surface)]">
                <BadgeCheck className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-sans font-medium text-base text-[var(--pm-text)] truncate">{name}</h4>
              {isTopRated && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3" /> Top Rated
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--pm-text-secondary)] mt-0.5">{followersCount.toLocaleString()} Followers</p>
          </div>
        </div>

        {/* Verification Pill Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-400/5 text-cyan-400 border border-cyan-400/10 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Business Verified
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 text-xs font-semibold">
            Active Trader
          </span>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-3 bg-[var(--pm-bg)]/40 p-3 rounded-xl border border-[var(--pm-border)]/50">
          <div>
            <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase tracking-wider font-semibold">Response Rate</span>
            <p className="text-base font-bold text-white mt-0.5">{responseRate}</p>
          </div>
          <div>
            <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase tracking-wider font-semibold">Sourcing Speed</span>
            <p className="text-base font-bold text-white mt-0.5">&lt; 24h Handover</p>
          </div>
        </div>

        {/* Active Triggers */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <Button variant="outline" size="sm" className="w-full gap-2 rounded-xl h-10 text-xs font-medium" onClick={handleContact}>
            <MessageSquare className="w-4 h-4" /> Message Seller
          </Button>
          <Button variant="secondary" size="sm" className="w-full gap-2 rounded-xl h-10 text-xs font-medium bg-[var(--pm-glass)] hover:bg-[var(--pm-glass)]/80 text-[var(--pm-text)]">
            Store Profile <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
