import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageSquare, Share2, Bookmark, MapPin, Zap, 
  Star, ShieldCheck, CornerDownRight, Send, AlertCircle, ShoppingBag,
  MoreHorizontal, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedStore, Comment, Post } from '@/store/feedStore';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/store/notificationStore';
import { useCartStore } from '@/modules/cart/cartStore';
import { useCartDrawerStore } from '@/modules/cart/cartDrawerStore';
import { NegotiationPanel } from '../../social/NegotiationPanel';

// Helper to convert Bangla numbers to English digits for calculations
const parseBanglaToEnglishNumber = (str: string): number => {
  const banglaDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  let engStr = str.replace(/[০-৯]/g, (w) => banglaDigits[w] || w);
  engStr = engStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(engStr);
  return isNaN(parsed) ? 1000 : parsed;
};

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleLike, addComment } = useFeedStore();
  const { addNotification } = useNotificationStore();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState<'qa' | 'review'>('qa');
  const [starRating, setStarRating] = useState(5);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isNegotiatingOpen, setIsNegotiatingOpen] = useState(false);

  // Determine if the logged-in user is the seller/author of this post
  const isSellerOfPost = user?.role === 'seller' && (
    user.name === post.sellerName || post.authorId === user.id
  );

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(post.id);
    if (!post.isLiked) {
      addNotification(`"${post.content.slice(0, 20)}..." উইশলিস্টে যুক্ত করা হয়েছে!`, 'success');
    } else {
      addNotification(`উইশলিস্ট থেকে সরানো হয়েছে!`, 'info');
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (replyToId) {
      const parentComment = post.commentsList.find(c => c.id === replyToId);
      addComment(post.id, {
        authorName: user?.name || 'অনামী ইউজার',
        authorRole: user?.role || 'buyer',
        text: commentText,
        parentId: replyToId,
        isSellerReply: isSellerOfPost,
      });
      setReplyToId(null);
    } else {
      if (commentType === 'review') {
        addComment(post.id, {
          authorName: user?.name || 'হোলসেল ক্রেতা',
          authorRole: user?.role || 'buyer',
          text: commentText,
          verifiedBuyer: true,
          rating: starRating,
        });
      } else {
        addComment(post.id, {
          authorName: user?.name || 'জিজ্ঞাসু ক্রেতা',
          authorRole: user?.role || 'buyer',
          text: commentText,
        });
      }
    }
    setCommentText('');
  };

  return (
    <motion.div 
      className="bg-[var(--pm-surface)]/60 rounded-3xl p-4 group relative overflow-hidden transition-all duration-300 border border-white/5 hover:border-white/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 1. Shop Profile Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-cyan-950 to-indigo-950 p-0.5 border border-white/10 shrink-0 group-hover:border-cyan-500/50 transition-all shadow-xl">
             <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                <span className="font-black text-xs text-cyan-400 uppercase">{post.sellerName.charAt(0)}</span>
                {/* Status indicator */}
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
             </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
               <h3 className="text-xs font-black text-white uppercase tracking-wide">
                 {post.sellerName}
               </h3>
               {post.isVerified && (
                 <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
               )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[9px] font-black text-white/55 uppercase tracking-widest">2 min ago</span>
               <div className="w-1 h-1 rounded-full bg-white/25" />
               <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400/70" />
                  <span className="text-[9px] font-black text-white/55 uppercase tracking-widest">{post.location || 'Dhaka'}</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all active:scale-95">Follow</button>
           <button className="p-2 text-white/20 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* 2. Post Caption / Description */}
      <div 
        onClick={() => navigate(`/product/${post.id}`)}
        className="px-1 mb-4 space-y-2 cursor-pointer group-hover:text-cyan-400/80 transition-all"
      >
         <p className="text-xs font-bold text-white/70 leading-relaxed line-clamp-2">
            {post.content}
         </p>
         <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-black text-cyan-400/60 uppercase tracking-tighter">#Wholesale</span>
            <span className="text-[10px] font-black text-cyan-400/60 uppercase tracking-tighter">#BulkBuy</span>
            <span className="text-[10px] font-black text-cyan-400/60 uppercase tracking-tighter">#PaikarMart</span>
         </div>
      </div>

      {/* 3. Immersive Media Content */}
      <div 
        onClick={() => navigate(`/product/${post.id}`)}
        className="relative rounded-[2rem] overflow-hidden bg-slate-950 border border-white/5 aspect-[4/5] group/media mb-4 shadow-xl cursor-pointer"
      >
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1549463591-24c1882bd398?w=800&auto=format&fit=crop'} 
          className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-[2s] ease-out opacity-80 group-hover/media:opacity-100"
          alt="Product"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {post.discount && (
              <div className="glass-morphism px-3 py-1.5 rounded-xl border-orange-500/30 flex items-center gap-2 shadow-2xl">
                 <Zap className="w-3.5 h-3.5 text-orange-400 fill-current" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{post.discount} OFF</span>
              </div>
           )}
           <div className="glass-morphism px-3 py-1.5 rounded-xl border-cyan-500/30 flex items-center gap-2 shadow-2xl">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified</span>
           </div>
        </div>

        {/* Favorite Trigger */}
        <button 
           onClick={(e) => {
              e.stopPropagation();
              handleLikeClick(e);
           }}
           className="absolute top-4 right-4 p-3 rounded-2xl glass-morphism border-white/10 active:scale-90 transition-all z-20 group/heart"
        >
           <Heart className={`w-5 h-5 transition-all ${post.isLiked ? 'fill-rose-500 text-rose-500 scale-125' : 'text-white/60 group-hover/heart:text-rose-400'}`} />
        </button>

        {/* Bottom Info Gradient Area */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end z-10 transition-all">
           
           {/* Reviews & Stock */}
           <div className="flex items-center gap-2 text-amber-400 mb-1.5">
              <div className="flex gap-0.5">
                 <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-[10px] font-bold text-white/70">4.8</span>
              <span className="text-[9px] text-white/40">(2.4k reviews)</span>
           </div>

           {/* Price & Actions */}
           <div className="flex items-end justify-between gap-3">
              <div className="flex items-baseline gap-2">
                 <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">৳{post.price}</span>
                 {post.originalPrice && (
                    <span className="text-xs text-white/40 line-through">৳{post.originalPrice}</span>
                 )}
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     const { addItem } = useCartStore.getState();
                     const { open: openCart } = useCartDrawerStore.getState();
                     addItem({
                        id: post.id,
                        name: post.content.slice(0, 35) + ' (Lot)',
                        price: parseBanglaToEnglishNumber(post.price),
                        image: post.image,
                        portal: 'b2b',
                        coinCashback: Math.floor(parseBanglaToEnglishNumber(post.price) * 0.05)
                     });
                     addNotification(`"${post.content.slice(0, 20)}..." কার্টে যুক্ত হয়েছে!`, 'success');
                     openCart();
                   }}
                   className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white"
                 >
                    <ShoppingBag className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={(e) => {
                      e.stopPropagation();
                      setIsNegotiatingOpen(true);
                   }}
                   className="px-5 h-[34px] rounded-lg bg-[var(--pm-accent)] text-white font-bold text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all z-20 flex items-center justify-center"
                 >
                    Buy
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* 4. Social Interaction Bar */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/5 mx-1 mb-2">
         <div className="flex items-center gap-6">
            <button 
              onClick={handleLikeClick}
              className="flex items-center gap-2 group/btn"
            >
               <motion.div whileTap={{ scale: 1.2 }}>
                  <Heart className={`w-4.5 h-4.5 transition-all ${post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white/40 group-hover/btn:text-rose-400'}`} />
               </motion.div>
               <span className="text-xs font-medium text-white/50 group-hover/btn:text-white/80">{post.likes > 1000 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</span>
            </button>
            <button 
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="flex items-center gap-2 group/btn"
            >
               <MessageSquare className="w-4.5 h-4.5 text-white/40 group-hover/btn:text-white/80" />
               <span className="text-xs font-medium text-white/50 group-hover/btn:text-white/80">{post.commentsList.length}</span>
            </button>
            <button className="text-white/40 hover:text-white/80 transition-colors">
               <Share2 className="w-4 h-4" />
            </button>
         </div>
         
         {/* Buyers Active Status */}
         <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-medium text-white/40">12 Sourcing</span>
         </div>
      </div>

      {/* 5. Minimal Comment Preview */}
      {post.commentsList.length > 0 && (
         <div 
           onClick={() => setIsCommentsOpen(true)}
           className="mt-3 px-3 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3 items-center group/cmt cursor-pointer hover:bg-white/[0.04] transition-all"
         >
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
               <img src={`https://i.pravatar.cc/100?u=${post.commentsList[0].authorName}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
               <p className="text-[10px] text-white/60 font-bold line-clamp-1">
                  <span className="font-black text-cyan-400 mr-1">{post.commentsList[0].authorName}:</span>
                  {post.commentsList[0].text}
               </p>
               <span className="text-[8px] font-black text-white/20 uppercase mt-0.5">View all questions</span>
            </div>
            <ChevronRight className="w-3 h-3 text-white/20 group-hover/cmt:text-cyan-400 group-hover/cmt:translate-x-1 transition-all" />
         </div>
      )}

      {/* Comments Panel */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 mt-4 pt-4 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {post.commentsList.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                  <div className="flex-1 bg-white/5 rounded-2xl p-3">
                    <p className="text-[10px] font-black text-cyan-400 mb-1">{comment.authorName}</p>
                    <p className="text-[11px] text-white/80">{comment.text}</p>
                  </div>
                </div>
              ))}
              
              <div className="relative mt-2">
                <input 
                  type="text"
                  placeholder="Ask a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 p-1.5">
                   <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Negotiation & B2B Purchase Desk */}
      <AnimatePresence>
        {isNegotiatingOpen && (
          <NegotiationPanel 
            post={{
              id: post.id,
              sellerName: post.sellerName,
              content: post.content,
              price: post.price,
              originalPrice: post.originalPrice,
              image: post.image,
              stock: post.stock,
              type: post.type
            }} 
            onClose={() => setIsNegotiatingOpen(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
