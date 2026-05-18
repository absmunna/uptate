import React from 'react';
import HeroSection from '../components/home/HeroSection';
import QuickAccessGrid from '../components/home/QuickAccessGrid';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { ProductFeed as RecommendedProducts } from '../components/home/ProductFeed';

export default function Home() {
  return (
    <div className="flex flex-col gap-6 pb-8 w-full mx-auto px-4">
      <HeroSection />
      <QuickAccessGrid />
      <FeaturedCategories />
      <div>
        <h2 className="text-lg font-bold mb-4 text-[var(--pm-text)]">আপনার জন্য সুপারিশকৃত</h2>
        <RecommendedProducts />
      </div>
    </div>
  );
}
