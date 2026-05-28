import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, Heart, MessageSquare, Share2, Eye, Calendar,
  TrendingUp, Award, Newspaper, BookOpen, AlertCircle, Bookmark, Check
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  image: string;
  date: string;
  tag: 'market' | 'success' | 'tech' | 'announcement';
  tagLabel: string;
  likes: number;
  commentsCount: number;
  views: string;
  readTime: string;
}

const CATEGORIES = [
  { id: 'all', label: 'সব আপডেট' },
  { id: 'market', label: 'বাজারের খবর (৳)' },
  { id: 'success', label: 'উদ্যোক্তার গল্প' },
  { id: 'tech', label: 'স্মার্ট বিজনেস' },
  { id: 'announcement', label: 'বিজ্ঞপ্তি' }
];

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'পেঁয়াজ ও ভোজ্য তেলের পাইকারি বাজারে রেকর্ড দরপতন, স্বস্তিতে খুচরা বিক্রেতারা',
    summary: 'খাতুনগঞ্জ এবং কারওয়ান বাজারের আড়তগুলোতে ভারতীয় নতুন পেঁয়াজ আমদানির ফলে ও তেলের শুল্ক হ্রাসে প্রতি মণে দাম কমেছে ৪০০ টাকা পর্যন্ত।',
    content: 'রমজানের পর হঠাৎ করে খাতুনগঞ্জ এবং কারওয়ান বাজারের পেঁয়াজ আড়তগুলোতে ভারতীয় নতুন পেঁয়াজ ও দেশি মুড়িকাটা পেঁয়াজের সরবরাহ উপচে পড়ছে। আমদানিকারকরা জানিয়েছেন, পর্যাপ্ত সরবরাহ ও সরকারের শুল্ক নীতি সংস্কারের ফলে ভোজ্য তেলের আমদানি রেকর্ড ছুঁয়েছে। বাজারে চাহিদার চেয়ে সরবরাহ বেশি থাকায় পাইকারি বাজারে ভোজ্য তেল ব্যারেল প্রতি কমেছে ৩০০ টাকা এবং পেঁয়াজ প্রতি কেজি কমেছে ১২-১৫ টাকা। খুচরা বিক্রেতারা বলছেন এর প্রভাব আগামী ২-৩ দিনে সরাসরি ভোক্তাসাধারণের উপর পড়বে। ব্যবসায়ী প্রতিনিধিদের দাবি, সিন্ডিকেট রোধে এই স্থিতিশীলতা ধরে রাখতে নিয়মিত মনিটরিং হওয়া প্রয়োজন।',
    author: {
      name: 'শরীফুল ইসলাম',
      avatar: 'SH',
      role: 'সিনিয়র মার্কেট অ্যানালিস্ট'
    },
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
    date: '২১ মে, ২০২৬',
    tag: 'market',
    tagLabel: 'মার্কেট আপডেট',
    likes: 345,
    commentsCount: 48,
    views: '১২.৪K',
    readTime: '৩ মিনিট'
  },
  {
    id: 'news-2',
    title: 'শূন্য থেকে শুরু করে সফল পাইকারি বিক্রেতা: বগুড়ার শামীম মিয়ার ১ কোটি টাকার টার্নওভারের রহস্য',
    summary: 'মাত্র ১০,০০০ টাকা মূলধন নিয়ে মসলা ব্যবসা শুরু করে শামীম মিয়া আজ উত্তরবঙ্গের মসলা ক্যাটাগরির অন্যতম শীর্ষ ভেন্ডর।',
    content: 'আজ থেকে সাত বছর আগে বগুড়ার মহাস্থানগড় এলাকায় একটি ছোট টিনের চালার নিচে শামীম মিয়া স্থানীয় কৃষকদের কাছ থেকে শুকনো মরিচ ও হলুদ সংগ্রহ করে গুঁড়ো করে প্যাকেটজাত করতে শুরু করেন। আর্থিক জটিলতা ও আস্থার সংকটে প্রথম দুই বছর কোনো লাভের মুখ দেখেননি। কিন্তু পণ্যের শতভাগ মানের নিশ্চয়তা এবং সঠিক বিপণনের ফলে আজ তাঁর নাম দেশজুড়ে ছড়িয়ে পড়েছে। বর্তমান ডিজিটাল সামাজিক কমার্স প্লাটফর্ম এবং পেইকারমার্ট অ্যাপ ব্যবহার করে তাঁর বার্ষিক ব্যবসার টার্নওভার ছাড়িয়েছে ১ কোটি টাকা। নতুন উদ্যোক্তাদের উদ্দেশ্যে শামীম মিয়া বলেন, "ধৈর্য্য এবং খাঁটি মানের কোনো বিকল্প নেই।"',
    author: {
      name: 'তানজিলা কাদির',
      avatar: 'TK',
      role: 'স্টোরি রাইটার'
    },
    image: 'https://images.unsplash.com/photo-1513846714041-2faf68b441f6?w=600&h=400&fit=crop',
    date: '১৯ মে, ২০২৬',
    tag: 'success',
    tagLabel: 'সফলতার গল্প',
    likes: 560,
    commentsCount: 92,
    views: '২৫.৮K',
    readTime: '৫ মিনিট'
  },
  {
    id: 'news-3',
    title: 'পেইকারমার্ট সোশ্যাল কমার্স: ক্ষুদ্র বিক্রেতাদের জন্য অটোমেটিক রিটেইলার সলিউশন চালু',
    summary: 'নতুন আপডেটে থাকছে মেসেজিং চ্যাটবক্স, এক ক্লিকে পেমেন্ট রিসিভ ও রিটেইল ক্যাশব্যাক ফিচার।',
    content: 'পেইকারমার্ট সুপার অ্যাপ বাংলাদেশের কোটি ক্ষুদ্র ও মাঝারি ব্যবসায়ী এবং খামারি বিক্রেতাদের জন্য সম্পূর্ণ ফ্রি সোশ্যাল কমার্স মডিউল রিলিজ করেছে। এর মাধ্যমে যেকোনো সেলার কোনো কোডিং জ্ঞান ছাড়াই নিজের প্রোফাইল লিংক সোশ্যাল মিডিয়ায় ছড়িয়ে দিয়ে সরাসরি কাস্টমারদের অর্ডার নিতে ও পেমেন্ট গেটওয়ের মাধ্যমে টাকা তুলতে পারবেন। এছাড়াও নতুন আপডেটে সিকিউরড ওয়ালেট এবং রিটেইলার রিওয়ার্ড কয়েন সুবিধা যুক্ত করা হয়েছে, যা খুচরা ক্রয়ে ভেন্ডরদের দারুণ ক্যাশব্যাক বোনাস প্রদান করবে।',
    author: {
      name: 'টেক ডেসক পেইকারমার্ট',
      avatar: 'PM',
      role: 'অফিসিয়াল আপডেট'
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    date: '১৭ মে, ২০২৬',
    tag: 'tech',
    tagLabel: 'টেক আপডেট',
    likes: 210,
    commentsCount: 31,
    views: '৮.৫K',
    readTime: '২ মিনিট'
  },
  {
    id: 'news-4',
    title: 'মরিচ ও আদার আন্তর্জাতিক এলসি সহজীকরণ করছে বাংলাদেশ ব্যাংক',
    summary: 'যোগান স্বাভাবিক রাখতে ভারত ও চীন থেকে মসলা আমদানিতে এলসি মার্জিন কমিয়ে করার সিদ্ধান্ত গৃহীত।',
    content: 'আসন্ন কোরবানির ঈদকে সামনে রেখে বাজারে গরম মশলার দাম সহনীয় ও যোগান নিশ্চিত করতে বাংলাদেশ ব্যাংক এক জরুরি সার্কুলারে আদা, রসুন, এলাচ এবং জিরার আমদানিকারকদের জন্য এলসি মার্জিন কমানোর ঘোষণা দিয়েছে। এর ফলে আমদানিকারকরা ব্যাংকে কম পরিমাণ মার্জিন জমা রেখেই বড় ঋণপত্র খুলতে পারবেন, যা অভ্যন্তরীণ বাজারে পণ্য সরবরাহ প্রচুর বাড়িয়ে অসাধু ব্যবসায়ীদের কৃত্রিম সংকট সৃষ্টির অপচেষ্টা রুখবে।',
    author: {
      name: 'অর্থনীতি রিপোর্ট',
      avatar: 'ER',
      role: 'নিউজ রিপোর্টার'
    },
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
    date: '১৫ মে, ২০২৬',
    tag: 'market',
    tagLabel: 'বাজারের খবর',
    likes: 180,
    commentsCount: 19,
    views: '৭.২K',
    readTime: '৩ মিনিট'
  }
];

export default function SocialNewsHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const init: Record<string, { count: number; liked: boolean }> = {};
    MOCK_NEWS.forEach(n => {
      init[n.id] = { count: n.likes, liked: false };
    });
    return init;
  });
  const [commentInput, setCommentInput] = useState('');
  const [commentsState, setCommentsState] = useState<Record<string, Array<{ id: string; user: string; text: string; date: string }>>>({
    'news-1': [
      { id: 'c1', user: 'মাহমুদ শিকদার', text: 'খুবই স্বস্তির খবর, খুচরা বাজারে এখন দাম কমার অপেক্ষায় রইলাম।', date: '২ ঘণ্টা আগে' },
      { id: 'c2', user: 'জাকির ভেন্ডর', text: 'পাইকারি রেট ঠিক থাকলেও মাঝখানের চালানি সিন্ডিকেট যেন কমিশন বেশি না নেয়।', date: '১ ঘণ্টা আগে' }
    ]
  });

  const toggleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    setLikesState(prev => {
      const current = prev[articleId];
      if (current.liked) {
        return { ...prev, [articleId]: { count: current.count - 1, liked: false } };
      } else {
        return { ...prev, [articleId]: { count: current.count + 1, liked: true } };
      }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedArticle) return;

    const newComment = {
      id: Date.now().toString(),
      user: 'আপনি (পেইকার ইউজার)',
      text: commentInput.trim(),
      date: 'ঠিক এখন'
    };

    setCommentsState(prev => ({
      ...prev,
      [selectedArticle.id]: [newComment, ...(prev[selectedArticle.id] || [])]
    }));
    setCommentInput('');
  };

  const filteredNews = MOCK_NEWS.filter(news => {
    const matchSearch = news.title.toLowerCase().includes(search.toLowerCase()) || 
                        news.summary.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || news.tag === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] relative">
      {/* Header View */}
      <div className="flex items-center gap-3 px-3 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1.5"><Newspaper className="w-5 h-5 text-[var(--pm-accent)]" /> খবরের কাগজ</h1>
          <p className="text-[11px] text-[var(--pm-text-secondary)]">পাইকারি বাজার দরের প্রতিদিনের বিশ্লেষণ ও সফল উদ্যোক্তার কথা</p>
        </div>
      </div>

      {/* Heavy-duty breaking news ribbon ticker */}
      <div className="px-3 mb-4">
        <div className="bg-red-550 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] uppercase font-black text-amber-500 tracking-wider">ব্রেকিং মার্কেট রেট</span>
            <p className="text-xs font-bold text-[var(--pm-text)] line-clamp-1">খাতুনগঞ্জে পেঁয়াজের আড়তে দাম কেজি প্রতি ১০ টাকা হ্রাস পেয়েছে!</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-3 mb-4">
        <div 
          className="flex items-center gap-2 rounded-2xl px-3.5 py-3 border shadow-sm transition-all focus-within:ring-2 focus-within:ring-[var(--pm-accent)]"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input 
            type="text" 
            placeholder="আর্টিকেল বা বিষয়ের নাম খুঁজুন..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" 
          />
        </div>
      </div>

      {/* Horizontal pill list of categories */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-3.5 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all"
            style={activeCategory === cat.id
              ? { background: 'var(--pm-accent)', color: '#fff', borderColor: 'var(--pm-accent)' }
              : { background: 'var(--pm-surface)', color: 'var(--pm-text-secondary)', borderColor: 'var(--pm-border)' }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content Stream list */}
      <div className="px-3 space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl">
            <BookOpen className="w-10 h-10 mx-auto text-[var(--pm-text-secondary)] opacity-40 mb-3" />
            <p className="text-sm font-semibold text-[var(--pm-text-secondary)]">কোনো খবর খুঁজে পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredNews.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedArticle(item)}
              className="rounded-2xl border overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 shadow-sm"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
            >
              {/* Feature Image of Card */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img 
                  referrerPolicy="no-referrer"
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-[#fff] px-3 py-1 rounded-full border border-white/5 uppercase tracking-wide">
                  {item.tagLabel}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/45 backdrop-blur-sm text-[10px] text-white/90 px-2 py-0.5 rounded-md font-semibold">
                  📖 {item.readTime} পড়া
                </span>
              </div>

              {/* Main Content Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-[11px] text-[var(--pm-text-secondary)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                  <span className="text-[var(--pm-border)]">|</span>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views} ভিউস</span>
                </div>

                <h3 className="font-extrabold text-sm text-[var(--pm-text)] leading-snug line-clamp-2 mb-2 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-xs text-[var(--pm-text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Footer Reactions bar */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--pm-border)] text-[var(--pm-text-secondary)]">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <div className="w-7 h-7 rounded-full bg-[var(--pm-accent)]/15 flex items-center justify-center text-[10px] font-extrabold text-[var(--pm-accent)]">
                      {item.author.avatar}
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--pm-text)] leading-tight">{item.author.name}</p>
                      <p className="text-[8px] text-[var(--pm-text-secondary)]">{item.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => toggleLike(e, item.id)}
                      className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${likesState[item.id]?.liked ? 'text-rose-500 fill-rose-500' : ''}`} />
                      <span className="text-[11px] font-bold font-mono">{likesState[item.id]?.count ?? item.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[11px] font-bold font-mono">{(commentsState[item.id]?.length ?? item.commentsCount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Article Detail View Reader Overlap */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            {/* Backdrop click to quit */}
            <div className="absolute inset-0" onClick={() => setSelectedArticle(null)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[480px] rounded-t-[32px] p-5 shadow-2xl border-t flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)', maxHeight: '92dvh' }}
            >
              {/* Handlebar */}
              <div className="w-12 h-1 bg-[var(--pm-border)] rounded-full mx-auto mb-4" />

              {/* Scroll Container of Articles */}
              <div className="flex-1 overflow-y-auto pb-6 hide-scrollbar">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-orange-500/10 text-[var(--pm-accent)] border border-orange-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedArticle.tagLabel}
                  </span>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs font-bold text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>

                <h1 className="text-base font-extrabold text-[var(--pm-text)] tracking-tight leading-snug mb-3">
                  {selectedArticle.title}
                </h1>

                {/* Author Banner */}
                <div className="p-3 rounded-2xl flex items-center justify-between border mb-4" style={{ background: 'var(--pm-bg)', borderColor: 'var(--pm-border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--pm-accent)]/10 flex items-center justify-center text-xs font-bold text-[var(--pm-accent)]">
                      {selectedArticle.author.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">{selectedArticle.author.name}</p>
                      <p className="text-[10px] text-[var(--pm-text-secondary)]">{selectedArticle.author.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--pm-text-secondary)]">{selectedArticle.date}</span>
                </div>

                {/* Image Banner */}
                <div className="h-44 rounded-2xl overflow-hidden mb-4 border" style={{ borderColor: 'var(--pm-border)' }}>
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedArticle.image} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Full Article Content Text (Bengali First) */}
                <p className="text-[#d8d8e5] text-xs leading-relaxed font-normal whitespace-pre-line mb-6">
                  {selectedArticle.content}
                </p>

                {/* Action panel */}
                <div className="flex items-center justify-between py-4 border-y border-[var(--pm-border)] text-xs text-[var(--pm-text-secondary)] mb-6">
                  <button 
                    onClick={(e) => toggleLike(e, selectedArticle.id)}
                    className="flex items-center gap-2 font-bold cursor-pointer hover:text-rose-500"
                  >
                    <Heart className={`w-4 h-4 ${likesState[selectedArticle.id]?.liked ? 'text-rose-500 fill-rose-500' : ''}`} />
                    <span>{likesState[selectedArticle.id]?.count ?? selectedArticle.likes} লাইক দিন</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-semibold text-[var(--pm-text-secondary)]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>পড়তে {selectedArticle.readTime} লাগবে</span>
                  </div>
                </div>

                {/* Comment Section Panel */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs text-[var(--pm-text)]">মন্তব্য সমূহ ({commentsState[selectedArticle.id]?.length || 0})</h3>
                  
                  {/* Form to submit comments */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      placeholder="আপনার মন্তব্য লিখুন..."
                      className="flex-1 text-xs p-3 rounded-xl border bg-[var(--pm-bg)] outline-none text-[var(--pm-text)] focus:border-[var(--pm-accent)]"
                      style={{ borderColor: 'var(--pm-border)' }}
                    />
                    <button 
                      type="submit"
                      className="bg-[var(--pm-accent)] hover:bg-orange-650 px-4 py-2 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center active:scale-95 transition-all"
                    >
                      উত্তর
                    </button>
                  </form>

                  {/* List of comments */}
                  <div className="space-y-2.5">
                    {(commentsState[selectedArticle.id] || []).length === 0 ? (
                      <p className="text-[11px] text-[var(--pm-text-secondary)] text-center py-4">এই খবরের উপর কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন!</p>
                    ) : (
                      commentsState[selectedArticle.id].map(comment => (
                        <div 
                          key={comment.id} 
                          className="p-3 rounded-xl border flex flex-col bg-[var(--pm-bg)]/40" 
                          style={{ borderColor: 'var(--pm-border)' }}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-[11px] text-[var(--pm-text)]">{comment.user}</span>
                            <span className="text-[9px] text-[var(--pm-text-secondary)]">{comment.date}</span>
                          </div>
                          <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
