import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { HeroBanner, StatsRow, CategorySection } from '../components/home/HomeFeatures';
import { useLocationStore } from '../modules/location/locationStore';
import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to load posts');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
      active
        ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-md'
        : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)]'
    }`}
  >
    {label}
  </button>
);

export default function Feed() {
  const { city } = useLocationStore();
  const [activeFilter, setActiveFilter] = useState('সব');
  const filters = ['সব', 'শপ', 'অফার', 'লোকাল', 'পাইকারি'];

  const { data: posts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 30_000,
  });

  const filteredPosts = (posts as any[]).filter((post: any) => {
    const matchesFilter = activeFilter === 'সব' || (post.user?.type ?? post.vendorType ?? '').includes(activeFilter);
    const loc = post.user?.location ?? post.location ?? '';
    const matchesLocation = loc.toLowerCase().includes(city.toLowerCase()) || post.isPromoted || activeFilter !== 'লোকাল';
    return matchesFilter && matchesLocation;
  });

  return (
    <div className="flex flex-col gap-4 pb-10">
      <HeroBanner />
      <StatsRow />
      <CategorySection />

      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar sticky top-[60px] bg-[var(--pm-surface)]/80 backdrop-blur-xl z-20 border-b border-[var(--pm-border)]">
        {filters.map((f) => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      <div className="px-4 space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--pm-accent)]" />
            <p className="text-sm text-[var(--pm-text-muted)]">পোস্ট লোড হচ্ছে…</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center py-12 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-[var(--pm-text-muted)]">পোস্ট লোড করা যায়নি।</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-[var(--pm-accent)] font-bold underline"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredPosts.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--pm-surface-hover)] flex items-center justify-center text-3xl">🏜️</div>
            <p className="text-sm text-[var(--pm-text-muted)]">{city}-এ কোনো পোস্ট পাওয়া যায়নি। অন্য ফিল্টার ট্রাই করুন!</p>
          </div>
        )}

        {filteredPosts.map((post: any) => (
          <motion.div
            key={post.id}
            className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pm-accent)] to-[var(--pm-accent-2)] flex items-center justify-center text-xl shadow-inner overflow-hidden">
                  {post.vendor?.logoUrl || post.user?.avatarUrl ? (
                    <img src={post.vendor?.logoUrl ?? post.user?.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{post.vendor?.name?.[0] ?? post.user?.name?.[0] ?? '🛍'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[var(--pm-text)] leading-none">
                      {post.vendor?.name ?? post.user?.name ?? 'PaikarMart'}
                    </h3>
                    {post.isPromoted && (
                      <span className="text-[8px] font-black uppercase bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] px-1.5 py-0.5 rounded-full">
                        সুপারিশকৃত
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[var(--pm-text-muted)]" />
                    <span className="text-[10px] text-[var(--pm-text-muted)]">
                      {post.vendor?.location ?? post.user?.location ?? 'Bangladesh'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pb-3">
              <p className="text-sm text-[var(--pm-text)] leading-relaxed">{post.content ?? post.body ?? ''}</p>
            </div>

            {(post.imageUrl || post.image || post.mediaUrl) && (
              <div className="aspect-[4/3] w-full overflow-hidden border-y border-[var(--pm-border)]">
                <img
                  src={post.imageUrl ?? post.image ?? post.mediaUrl}
                  alt="Post media"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-4 border-t border-[var(--pm-border)]/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-red-500 transition-colors group">
                  <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                  <span className="text-xs font-bold">{post.likeCount ?? post.likes ?? 0}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">{post.commentCount ?? post.comments ?? 0}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              {post.productId && (
                <button className="bg-[var(--pm-accent)] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" /> কিনুন
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
