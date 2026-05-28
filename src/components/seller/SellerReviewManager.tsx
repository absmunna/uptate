import React from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, ChevronDown, User, Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SellerReviewManager: React.FC = () => {
  // Mock reviews for the dashboard visibility
  const reviews = [
    { 
      id: 'r1', 
      user: 'Nirjon M.', 
      rating: 5, 
      text: 'Original product quality is quite exceptional. The packaging was also very secure for long distance shipping.', 
      date: '2h ago',
      verified: true
    },
    { 
      id: 'r2', 
      user: 'Rahima B.', 
      rating: 4, 
      text: 'Good value for money. Sizing was slightly smaller than expected but still fits well.', 
      date: '1d ago',
      verified: true
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Reputation Feed
           </h3>
           <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-white">4.8</span>
               <div className="flex items-center gap-0.5">
                   {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-2.5 h-2.5", i <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-700")} />)}
               </div>
           </div>
       </div>

       <div className="flex flex-col gap-4">
           {reviews.map((review) => (
               <div key={review.id} className="p-4 rounded-2xl bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] flex flex-col gap-3 group">
                   <div className="flex items-start justify-between">
                       <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase">
                               {review.user.charAt(0)}
                           </div>
                           <div>
                               <div className="flex items-center gap-2">
                                   <p className="text-xs font-bold text-white">{review.user}</p>
                                   {review.verified && (
                                       <span className="flex items-center gap-0.5 text-[8px] font-black text-cyan-400 uppercase tracking-tighter bg-cyan-400/10 px-1 py-0.25 rounded border border-cyan-400/20">
                                           <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                       </span>
                                   )}
                               </div>
                               <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">{review.date}</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-0.25">
                           {[1,2,3,4,5].map(i => (
                               <Star key={i} className={cn("w-2 h-2", i <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-800")} />
                           ))}
                       </div>
                   </div>

                   <p className="text-[11px] text-zinc-400 leading-relaxed italic">"{review.text}"</p>

                   <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                       <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer">
                           <Reply className="w-3 h-3" /> Reply
                       </button>
                       <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors cursor-pointer">
                           <ThumbsUp className="w-3 h-3" /> Thank
                       </button>
                       <button className="ml-auto text-zinc-700 hover:text-zinc-500 cursor-pointer">
                           <MoreHorizontal className="w-4 h-4" />
                       </button>
                   </div>
               </div>
           ))}
       </div>

       <button className="w-full py-2.5 rounded-xl border border-[var(--pm-border)] text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/10 transition-all cursor-pointer">
           View All Review Analytics
       </button>
    </div>
  );
};
