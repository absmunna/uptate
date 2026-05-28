import React from 'react';
import { useProductStore } from '../../app/store/productStore';
import { ChevronLeft, ChevronRight, Flame, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductMediaGalleryProps {
  images: string[];
  title: string;
  viralityBadge?: string;
  trendingScore?: number;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({
  images,
  title,
  viralityBadge = "🔥 Top Viral",
  trendingScore = 9.8,
}) => {
  const { activeImageIndex, setActiveImageIndex, isSaved, setIsSaved } = useProductStore();

  const handlePrev = () => {
    setActiveImageIndex(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
  };

  const handleNext = () => {
    setActiveImageIndex(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1);
  };

  const handleShare = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (e) {
      console.warn("[ProductMediaGallery] Copy failed:", e);
      // Fallback for non-secure context or restricted iframes
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        toast.success("Product link copied (fallback)");
      } catch (err) {
        toast.error("Manual copy required");
      }
      document.body.removeChild(input);
    }
  };

  const currentImage = images[activeImageIndex] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1:1 Large Media Viewer */}
      <div className="relative w-full aspect-square bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden shadow-md select-none group">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Floating Accent Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="h-7 px-3 rounded-full bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 fill-current" />
            {viralityBadge}
          </span>
          <span className="h-7 px-3 rounded-full bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center backdrop-blur-md">
            Score: {trendingScore}
          </span>
        </div>

        {/* Floating Quick Action Overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            onClick={() => {
              setIsSaved(!isSaved);
              toast.success(isSaved ? "Removed from saved items" : "Added to saved items");
            }}
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 hover:scale-105 transition-all backdrop-blur-md"
          >
            <Heart className={cn("w-5 h-5", isSaved ? "text-rose-500 fill-rose-500" : "text-white")} />
          </Button>
          <Button
            onClick={handleShare}
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 hover:scale-105 transition-all backdrop-blur-md"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Carousel Nav Triggers (Shown on Hover/Touch) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 touch-target"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 touch-target"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Grid Thumb Strip (80x80px items below) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={cn(
                "w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 relative",
                activeImageIndex === idx
                  ? "border-[var(--pm-accent)] scale-95 shadow"
                  : "border-[var(--pm-border)] hover:border-white/20 opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
