import React, { useEffect } from 'react';
import { useFeedStore } from '../../store/feedStore';
import { feedService } from '../../services/feedService';
import { FeedPostCard } from '../../../components/feed/FeedPostCard';
import { HeroSpotlight } from '../../../components/home/HeroSpotlight';

export const HomeFeedPage: React.FC = () => {
  const { items, setItems, setLoading } = useFeedStore();

  useEffect(() => {
    setLoading(true);
    feedService.fetchFeed().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [setItems, setLoading]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <HeroSpotlight />
      <div className="space-y-6 mt-6">
        {items.map((item) => (
          <FeedPostCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
