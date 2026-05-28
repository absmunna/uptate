import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MessageSquare, Search, MoreVertical, 
  CheckCheck, Clock, ShieldCheck, Store, Filter
} from 'lucide-react';
import { BackButton } from '@/components/ui/PremiumButtons';

interface Chat {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  type: 'vendor' | 'customer' | 'support';
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    senderName: 'Keraniganj Bulk Store',
    senderAvatar: 'KB',
    lastMessage: 'ভাই, আপনার অর্ডারটি কি কনফার্ম করব?',
    time: '১ মিনিট আগে',
    unreadCount: 3,
    isOnline: true,
    isVerified: true,
    type: 'vendor'
  },
  {
    id: '2',
    senderName: 'Chawkbazar Cosmetics Hub',
    senderAvatar: 'CC',
    lastMessage: 'নতুন স্টক আগামী কাল আসবে।',
    time: '১০ মিনিট আগে',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    type: 'vendor'
  },
  {
    id: '3',
    senderName: 'Rahim Uddin (Retailer)',
    senderAvatar: 'RU',
    lastMessage: 'লটের স্যাম্পল দেখা যাবে?',
    time: '১ ঘণ্টা আগে',
    unreadCount: 1,
    isOnline: true,
    isVerified: false,
    type: 'customer'
  }
];

export const ChatList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <BackButton onBack={() => navigate(-1)} size="md" variant="glass" className="border-white/10 bg-white/5 hover:bg-white/10" />
             <div>
                <h1 className="text-xl font-black flex items-center gap-2">
                   <MessageSquare className="w-6 h-6 text-[var(--pm-accent)]" /> মেসেজ সেন্টার
                </h1>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">B2B Negotiation Terminal</p>
             </div>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
             <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text"
            placeholder="ভেন্ডর বা বায়ারের নাম খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--pm-accent)]/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {MOCK_CHATS.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/20 to-transparent flex items-center justify-center text-lg font-black text-[var(--pm-accent)] border border-white/5">
                  {chat.senderAvatar}
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0c0c16]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <h3 className="font-black text-sm truncate">{chat.senderName}</h3>
                    {chat.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-white/30 font-bold whitespace-nowrap">{chat.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/50 truncate pr-4">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[var(--pm-accent)] text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-[var(--pm-accent)] shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                   <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase text-white/40">
                      {chat.type}
                   </div>
                   {chat.unreadCount === 0 && <CheckCheck className="w-3.5 h-3.5 text-blue-400 opacity-50" />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
