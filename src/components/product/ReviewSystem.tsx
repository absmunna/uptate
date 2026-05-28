import React, { useState } from 'react';
import { Star, CheckCircle2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer: boolean;
  images?: string[];
}

interface ReviewSystemProps {
  reviews: Review[];
  productId: string;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({ reviews: initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);

  // Compute stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : "0.0";

  const num5Star = reviews.filter(r => r.rating === 5).length;
  const num4Star = reviews.filter(r => r.rating === 4).length;
  const num3Star = reviews.filter(r => r.rating === 3).length;
  const num2Star = reviews.filter(r => r.rating === 2).length;
  const num1Star = reviews.filter(r => r.rating === 1).length;

  const percentage = (count: number) => (totalReviews > 0 ? (count / totalReviews) * 100 : 0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please add review comment content");
      return;
    }

    const newReview: Review = {
      id: `r_${Date.now()}`,
      userName: "You (Verified Buyer)",
      rating,
      comment: newComment,
      createdAt: "Just now",
      isVerifiedBuyer: true,
    };

    setReviews([newReview, ...reviews]);
    setNewComment('');
    setRating(5);
    setShowForm(false);
    toast.success("Review submitted successfully");
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-[var(--pm-surface)] border border-[var(--pm-border)] p-6 rounded-2xl">
        {/* Left Column: Aggregates */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-black/20 rounded-xl border border-[var(--pm-border)]/50 shrink-0 select-none">
          <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{avgRating}</span>
          <div className="flex gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--pm-text-secondary)] font-medium">Based on {totalReviews} Reviews</span>
        </div>

        {/* Middle Column: Star level distribution */}
        <div className="flex-1 w-full space-y-2 select-none">
          <div className="flex items-center gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
            <span className="w-12 text-right">5 Stars</span>
            <Progress value={percentage(num5Star)} className="h-2 flex-grow bg-zinc-800" />
            <span className="w-8 text-right font-bold text-white">{num5Star}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
            <span className="w-12 text-right">4 Stars</span>
            <Progress value={percentage(num4Star)} className="h-2 flex-grow bg-zinc-800" />
            <span className="w-8 text-right font-bold text-white">{num4Star}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
            <span className="w-12 text-right">3 Stars</span>
            <Progress value={percentage(num3Star)} className="h-2 flex-grow bg-zinc-800" />
            <span className="w-8 text-right font-bold text-white">{num3Star}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
            <span className="w-12 text-right">2 Stars</span>
            <Progress value={percentage(num2Star)} className="h-2 flex-grow bg-zinc-800" />
            <span className="w-8 text-right font-bold text-white">{num2Star}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
            <span className="w-12 text-right">1 Star</span>
            <Progress value={percentage(num1Star)} className="h-2 flex-grow bg-zinc-800" />
            <span className="w-8 text-right font-bold text-white">{num1Star}</span>
          </div>
        </div>

        {/* Right Column: CTA */}
        <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 self-stretch justify-center">
          <Button onClick={() => setShowForm(!showForm)} className="w-full text-xs font-semibold rounded-xl h-11 bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90">
            Write a Review
          </Button>
          <Button variant="outline" className="w-full text-xs font-medium rounded-xl h-11 gap-1.5 border-[var(--pm-border)] hover:bg-[var(--pm-glass)]">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Reviews
          </Button>
        </div>
      </div>

      {/* Review Composer Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-5 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-200">
          <h3 className="text-base font-semibold text-white">Write Your Review</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--pm-text-secondary)]">Your Star Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell other buyers about your experience..."
              className="h-24 px-4 py-3 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="rounded-xl h-10 border-[var(--pm-border)]">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl h-10 px-6 bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90">
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center py-6 text-[var(--pm-text-secondary)] text-sm italic">No reviews yet. Be the first to add your rating!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 border border-[var(--pm-border)]/50 bg-[var(--pm-surface)]/40 rounded-2xl flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[var(--pm-glass)] border border-[var(--pm-border)] flex items-center justify-center">
                    <span className="text-sm font-bold text-[var(--pm-accent)]">{rev.userName.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{rev.userName}</span>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 fill-current" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--pm-text-secondary)]">{rev.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--pm-text-secondary)] leading-relaxed pl-12">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
