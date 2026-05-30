import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useListPosts, getListPostsQueryKey } from "@workspace/api-client-react";
import { Link } from "react-router-dom";
import { formatBDT } from "@/lib/format";
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Store,
  ShoppingBag, Volume2, VolumeX, Play, Pause, Bookmark,
  ChevronUp, ChevronDown, BadgeCheck, Zap, Search, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Reels() {
  const { data: posts, isLoading } = useListPosts({ type: "video" }, { query: { queryKey: getListPostsQueryKey({ type: "video" }) } });
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-[11px] text-white/40 font-black uppercase tracking-widest">Loading Reels…</p>
        </div>
      </div>
    );
  }

  const allPosts = posts || [];

  if (!allPosts.length) {
    return (
      <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Play className="w-8 h-8 text-white/30" />
        </div>
        <p className="text-[14px] font-black text-white/40">No reels yet</p>
        <p className="text-[11px] text-white/20">Check back soon for fresh content</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-black" style={{ overscrollBehavior: "none" }}>
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-safe-top pb-3" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
        <h2 className="text-[15px] font-black text-white tracking-tight">🎬 PaikarReels</h2>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {allPosts.map((post, index) => (
        <ReelItem key={post.id} post={post} isActive={index === activeIndex} index={index} onVisible={() => setActiveIndex(index)} />
      ))}
    </div>
  );
}

function ReelItem({ post, isActive, index, onVisible }: { post: any; isActive: boolean; index: number; onVisible: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onVisible();
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    }, { threshold: 0.6 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onVisible]);

  useEffect(() => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const updateProgress = () => {
      if (vid.duration) setProgress(vid.currentTime / vid.duration);
    };
    vid.addEventListener("timeupdate", updateProgress);
    return () => vid.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked) {
        setLiked(true);
        setLikeCount(c => c + 1);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 900);
      }
    }
    lastTapRef.current = now;
  };

  const toggleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
    if (!liked) { setShowHeart(true); setTimeout(() => setShowHeart(false), 900); }
  };

  const thumbnailUrl = post.mediaUrl || post.images?.[0] || `https://picsum.photos/seed/${index + 20}/400/800`;
  const videoUrl = post.videoUrl || "";
  const vendorName = post.vendor?.name || post.user?.displayName || "Unknown";
  const vendorAvatar = post.vendor?.avatarUrl || post.user?.avatarUrl || "";
  const productTag = post.products?.[0];

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full snap-start snap-always flex items-center justify-center bg-black overflow-hidden" onClick={handleDoubleTap}>
      {/* Video/Image Background */}
      {videoUrl ? (
        <video ref={videoRef} src={videoUrl} loop muted={isMuted} playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={thumbnailUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Double Tap Heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-28 h-28 text-red-500 fill-red-500 drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to pause indicator */}
      <AnimatePresence>
        {!isPlaying && videoUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar (video only) */}
      {videoUrl && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-30">
          <div className="h-full bg-white transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {/* Right Action Bar */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-5" onClick={e => e.stopPropagation()}>
        {/* Avatar */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white bg-zinc-800">
            {vendorAvatar ? <img src={vendorAvatar} alt="" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-black">{vendorName[0]}</div>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-violet-500 border-2 border-black flex items-center justify-center">
            <span className="text-[8px] font-black text-white">+</span>
          </div>
        </div>

        {/* Like */}
        <button onClick={toggleLike} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.3 }} className={cn("w-11 h-11 rounded-full flex items-center justify-center", liked ? "bg-red-500/20" : "bg-black/40 backdrop-blur-sm")}>
            <Heart className={cn("w-6 h-6", liked ? "text-red-500 fill-red-500" : "text-white")} />
          </motion.div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">{likeCount.toLocaleString()}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">{(post.commentCount || 0).toLocaleString()}</span>
        </button>

        {/* Save */}
        <button onClick={() => { setSaved(s => !s); toast.success(saved ? "Removed from saved" : "Saved!"); }} className="flex flex-col items-center gap-1">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center", saved ? "bg-violet-500/20" : "bg-black/40 backdrop-blur-sm")}>
            <Bookmark className={cn("w-6 h-6", saved ? "text-violet-400 fill-violet-400" : "text-white")} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">Save</span>
        </button>

        {/* Share */}
        <button onClick={() => toast.success("Copied link!")} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">Share</span>
        </button>

        {/* Mute (video only) */}
        {videoUrl && (
          <button onClick={() => setIsMuted(m => !m)} className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-16 left-4 right-16 z-20" onClick={e => e.stopPropagation()}>
        {/* Vendor */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] font-black text-white drop-shadow-lg">@{vendorName.toLowerCase().replace(/\s+/g, "")}</span>
          {post.vendor?.verified && <BadgeCheck className="w-4 h-4 text-cyan-400" />}
          <button className="ml-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-black text-white">Follow</button>
        </div>

        {/* Title */}
        <p className="text-[12px] text-white/90 leading-relaxed mb-2 line-clamp-3 drop-shadow">{post.title || post.body || "Check out this product!"}</p>

        {/* Product Tag */}
        {productTag && (
          <Link to={`/product/${productTag.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-2">
            <ShoppingBag className="w-3 h-3 text-white" />
            <span className="text-[10px] font-black text-white">{productTag.title}</span>
            {productTag.price && <span className="text-[10px] text-white/70">· {formatBDT(productTag.price)}</span>}
          </Link>
        )}

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <p className="text-[10px] text-white/50">
            {post.tags.slice(0, 4).map((t: string) => `#${t}`).join(" ")}
          </p>
        )}
      </div>
    </div>
  );
}
