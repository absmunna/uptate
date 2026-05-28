import React from 'react';
import { InactiveSystemPortal } from '@/components/ui/InactiveSystemPortal';

export const NewsHome = () => {
  return (
    <div className="w-full max-w-[480px] mx-auto pt-16">
      <InactiveSystemPortal portalName="Local News" />
    </div>
  );
};
