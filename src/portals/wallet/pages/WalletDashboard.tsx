import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/components/feed/StoryBar';
import { PortalIconBar } from '@/components/home/PortalIconBar';
import { ArrowDownLeft, ArrowUpRight, Wallet, History, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const WalletDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetch('/api/v1/wallet').then(res => res.json())
  });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pm-bg)] pt-16">
      <section className="pt-3 md:pt-4">
        <StoryBar context="wallet" />
      </section>
      <section className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 pb-2">
        <PortalIconBar context="wallet" />
      </section>
      
      <main className="flex-1 p-4 space-y-6">
        {isLoading ? (
          <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--pm-accent)]"/></div>
        ) : (
          <>
            {/* Balance Card */}
            <GlassCard className="p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex items-center gap-2 text-[var(--pm-text-secondary)]">
                    <Wallet className="w-5 h-5" />
                    <span className="text-sm font-medium">Available Balance</span>
                </div>
                <h2 className="text-4xl font-black text-white">৳ {data?.balance || 0}</h2>
                <div className="flex items-center gap-4 pt-4">
                    <Button className="rounded-full bg-[var(--pm-accent)] h-10 px-6">
                        <ArrowDownLeft className="w-4 h-4 mr-2" /> Top Up
                    </Button>
                    <Button variant="outline" className="rounded-full border-[var(--pm-border)] h-10 px-6">
                        <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw
                    </Button>
                </div>
            </GlassCard>

            {/* Recent Transactions */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-[var(--pm-accent)]" /> Recent Transactions
                </h3>
                <div className="space-y-3">
                    {data?.transactions?.map((tx: any) => (
                        <GlassCard key={tx.id} className="p-4 flex items-center justify-between rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--pm-glass)] rounded-full text-[var(--pm-accent)]">
                                    <ArrowDownLeft className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{tx.description}</p>
                                    <p className="text-xs text-[var(--pm-text-secondary)]">{tx.date || "Recent"}</p>
                                </div>
                            </div>
                            <span className={`font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {tx.amount > 0 ? '+' : ''} ৳ {tx.amount}
                            </span>
                        </GlassCard>
                    ))}
                </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

