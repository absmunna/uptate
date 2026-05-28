import React from 'react';
import { BadgeCheck, MapPin, Star, Share2, MoreHorizontal } from 'lucide-react';

export interface UniversalProfileHeaderProps {
  coverImageUrl: string;
  avatarUrl: string;
  name: string;
  username: string;
  isVerified?: boolean;
  role?: 'Buyer' | 'Seller' | 'Factory' | 'Service Provider' | 'Logistics' | 'Admin';
  location?: string;
  followersCount: number;
  followingCount: number;
  rating?: number;
  onFollow?: () => void;
  onMessage?: () => void;
}

export const UniversalProfileHeader: React.FC<UniversalProfileHeaderProps> = ({
  coverImageUrl,
  avatarUrl,
  name,
  username,
  isVerified = false,
  role = 'Buyer',
  location,
  followersCount,
  followingCount,
  rating,
  onFollow,
  onMessage,
}) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-6">
      {/* Cover Image */}
      <div className="w-full relative">
        <img
          src={coverImageUrl}
          alt="Cover"
          className="w-full object-cover h-[180px] md:h-[320px] lg:h-[400px] rounded-none md:rounded-b-2xl lg:rounded-b-[24px]"
        />
      </div>

      {/* Profile Info Section */}
      <div className="flex flex-col md:flex-row md:items-start lg:gap-6 md:gap-4 relative">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <img
            src={avatarUrl}
            alt={name}
            className="w-[88px] h-[88px] md:w-[120px] md:h-[120px] lg:w-[160px] lg:h-[160px] rounded-full object-cover border-[3px] md:border-[4px] lg:border-[6px] border-[var(--pm-bg)] -mt-[44px] md:-mt-[60px] lg:-mt-[80px] bg-[var(--pm-surface)] relative z-10"
          />
        </div>

        {/* Details & Actions */}
        <div className="flex-1 mt-2 md:mt-3 lg:mt-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
          
          {/* Text Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight flex items-center justify-center md:justify-start gap-2 text-white">
              {name}
              {isVerified && <BadgeCheck className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />}
            </h1>
            
            <div className="flex items-center gap-2 mt-1 text-sm md:text-base text-gray-400 font-medium">
              <span>@{username}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-cyan-400">{role}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 lg:gap-4 mt-3 text-sm md:text-base text-gray-300">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {location}
                </span>
              )}
              {rating && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" /> {rating}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-white">
                  <strong>{followersCount.toLocaleString()}</strong> <span className="text-gray-400">Followers</span>
                </span>
                <span className="text-white">
                  <strong>{followingCount.toLocaleString()}</strong> <span className="text-gray-400">Following</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={onFollow}
              className="flex-1 md:flex-none h-10 md:h-11 lg:h-12 px-6 rounded-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold transition-colors duration-200"
            >
              Follow
            </button>
            <button 
              onClick={onMessage}
              className="flex-1 md:flex-none h-10 md:h-11 lg:h-12 px-6 rounded-full bg-[#1a2235] hover:bg-[#252f4a] text-white border border-white/10 font-semibold transition-colors duration-200"
            >
              Message
            </button>
            <button className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 rounded-full bg-[#1a2235] hover:bg-[#252f4a] border border-white/10 flex items-center justify-center text-white transition-colors duration-200">
              <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 rounded-full bg-[#1a2235] hover:bg-[#252f4a] border border-white/10 flex items-center justify-center text-white transition-colors duration-200">
              <MoreHorizontal className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
