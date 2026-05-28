import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface FeedPostCardProps {
  id: string;
  author: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({ author, content, imageUrl, likes, comments }) => {
  return (
    <div className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4 shadow-sm hover:border-[var(--pm-accent)] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--pm-glass)]" />
          <span className="font-semibold">{author}</span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-[var(--pm-text-secondary)]" />
      </div>

      {/* Content */}
      <p className="text-[var(--pm-text)] mb-3">{content}</p>
      {imageUrl && (
        <div className="w-full aspect-square rounded-xl bg-gray-200 mb-3 overflow-hidden">
          {/* Image would be injected here */}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-6 text-[var(--pm-text-secondary)]">
        <button className="flex items-center gap-2 hover:text-[var(--pm-accent)] transition-colors">
          <Heart className="h-5 w-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[var(--pm-accent)] transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>{comments}</span>
        </button>
        <Share2 className="h-5 w-5 ml-auto cursor-pointer hover:text-[var(--pm-accent)]" />
      </div>
    </div>
  );
};
