import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertCircle, ShoppingBag, Coins, Flame, Sparkles, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';
import { useCartStore } from '../../modules/cart/cartStore';
import { useCartDrawerStore } from '../../modules/cart/cartDrawerStore';
import { useNotificationStore } from '../../store/notificationStore';

interface NegotiationPanelProps {
  post: {
    id: string;
    sellerName: string;
    content: string;
    price: string;
    originalPrice?: string;
    image: string;
    stock?: string;
    type: 'Wholesale' | 'Retail' | 'Service' | 'Demand';
  };
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

// Convert Bangla numbers to English digits for calculations
const parseBanglaToEnglishNumber = (str: string): number => {
  const banglaDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  let engStr = str.replace(/[০-৯]/g, (w) => banglaDigits[w] || w);
  engStr = engStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(engStr);
  return isNaN(parsed) ? 500 : parsed;
};

export const NegotiationPanel: React.FC<NegotiationPanelProps> = ({ post, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const { addNotification } = useNotificationStore();

  const originalPriceNum = parseBanglaToEnglishNumber(post.price);
  
  // States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [targetQuantity, setTargetQuantity] = useState('10');
  const [targetPrice, setTargetPrice] = useState('');
  const [agreedPrice, setAgreedPrice] = useState<number | null>(null);
  const [negotiatingState, setNegotiatingState] = useState<'intro' | 'active' | 'agreed' | 'rejected'>('intro');
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize conversations
  useEffect(() => {
    const welcomeText = post.type === 'Wholesale'
      ? `আসসালামু আলাইকুম। আমি ${post.sellerName} এর পাইকারি সেলস ডেস্কে আছি। আপনার বাজেট এবং কত পিস (MOQ: ১০ পিস) লাগবে বলুন, আমরা সেরা দামের নিশ্চয়তা দিচ্ছি!`
      : `আসসালামু আলাইকুম। ${post.sellerName} এ স্বাগতম। পণ্যটি অর্ডার করতে চান, নাকি কোনো বিশেষ ছাড় প্রয়োজন?`;

    setMessages([
      {
        id: 'msg-init',
        sender: 'seller',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    // Set default target price suggesting 10% discount
    setTargetPrice(Math.floor(originalPriceNum * 0.9).toString());
  }, [post]);

  // Scroll to bottom on updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const buyerMsg = inputText.trim();
    const currentTime = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });

    // 1. Post buyer message
    const newBuyerMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: buyerMsg,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, newBuyerMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Trigger dynamic vendor bot response
    setTimeout(() => {
      let sellerReply = '';
      const qtyNum = parseInt(targetQuantity) || 10;
      const proposedPrice = parseFloat(targetPrice) || (originalPriceNum * 0.8);

      // Simple keywords search in buyer msg
      const normalizedMsg = buyerMsg.toLowerCase();
      const wantsDiscount = normalizedMsg.includes('কম') || normalizedMsg.includes('ডিসকাউন্ট') || normalizedMsg.includes('discount') || normalizedMsg.includes('ছাড়');
      const isTooLow = proposedPrice < originalPriceNum * 0.65;
      const isPerfectMatch = proposedPrice >= originalPriceNum * 0.85;

      if (negotiatingState === 'agreed') {
        sellerReply = `ভাইয়া, আমরা দাম ঠিক করে ফেলেছি (৳${agreedPrice})। অনুগ্রহ করে 'কার্টে যুক্ত করুন' বাটনে চাপ দিয়ে অর্ডার কনফার্ম করে নিন। ধন্যবাদ!`;
      } else if (normalizedMsg.includes('হ্যালো') || normalizedMsg.includes('হাই') || normalizedMsg.includes('hello')) {
        sellerReply = `জী ভাইয়া বলুন, আপনার কত পিস লাগবে? আমাদের স্টক এ পর্যাপ্ত ${post.content} রয়েছে।`;
      } else if (normalizedMsg.includes('স্টক') || normalizedMsg.includes('stock') || normalizedMsg.includes('কত পিস')) {
        sellerReply = `জী আমাদের কাছে ৫০০+ পিস রেডি স্টক আছে। আপনি সর্বোচ্চ কত পিস নিতে চান? বেশি নিলে রেট আরো কমিয়ে দেয়া যাবে।`;
      } else {
        // Evaluate proposed deal
        if (qtyNum >= 50 && proposedPrice >= originalPriceNum * 0.7) {
          // Bulk offer accepted
          const finalPrice = Math.floor(proposedPrice);
          setAgreedPrice(finalPrice);
          setNegotiatingState('agreed');
          sellerReply = `আলহামদুলিল্লাহ্‌! আপনারা ${qtyNum} পিস বিশাল অর্ডার দিচ্ছেন। আমরা আপনার প্রস্তাবিত ৳${finalPrice} স্পেশাল হোলসেল রেট মেনে নিচ্ছি। নিচে কার্ট চাপুন!`;
        } else if (isTooLow) {
          // Rejection or high counter-offer
          const counterPrice = Math.floor(originalPriceNum * 0.85);
          sellerReply = `দুঃখিত ভাইয়া, ৳${proposedPrice} করে দিলে আমাদের অনেক লোকসান হয়ে যাবে। ${qtyNum} পিসের জন্য অরিজিনাল হোলসেল রেট ৳${originalPriceNum}। আপনার জন্য বিশেষ ছাড় হিসেবে ৳${counterPrice} করে রাখতে পারবো। আপনার মতামত জানান?`;
        } else if (isPerfectMatch) {
          // Normal offer accepted
          const finalPrice = Math.floor(proposedPrice);
          setAgreedPrice(finalPrice);
          setNegotiatingState('agreed');
          sellerReply = `চমৎকার! আপনার পছন্দ করা ৳${finalPrice} মূল্যে অর্ডার প্রস্তুত। এটি স্পেশাল অফার এবং এই দামে খুবই সীমিত স্টক আছে। এখনই নিচে কার্ট এ ক্লিক করুন!`;
        } else {
          // Normal Negotiable
          const counterPrice = Math.floor(proposedPrice * 1.05);
          setAgreedPrice(counterPrice);
          setNegotiatingState('agreed');
          sellerReply = `আপনার প্রস্তাব পেয়ে ভালো লাগলো। তবে ৳${proposedPrice} একটু কম হয়ে যায়। ঠিক আছে, ব্যবসার খাতিরে মাঝা-মাঝি আপনার জন্য ৳${counterPrice} করে লক করে দিচ্ছি। আপনার কি এটি চলবে?`;
        }
      }

      const newSellerMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        text: sellerReply,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newSellerMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const submitQuickOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(targetQuantity) || 10;
    const priceProposed = parseFloat(targetPrice) || originalPriceNum;

    const buyerOfferMsg = `আমি ${qty} পিস নিতে চাচ্ছি। প্রতি পিসের দাম ৳${priceProposed} করে রাখা সম্ভব কি?`;
    
    // Simulate sending
    const currentTime = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    const newBuyerMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: buyerOfferMsg,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, newBuyerMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (qty >= 100 && priceProposed >= originalPriceNum * 0.7) {
        const finalPrice = Math.floor(priceProposed);
        setAgreedPrice(finalPrice);
        setNegotiatingState('agreed');
        reply = `অসাধারণ লট ডিল! ১০০+ পিসের জন্য আমরা আপনার প্রস্তাবিত ৳${finalPrice} অফারটি সানন্দে গ্রহণ করছি। অনুগ্রহ করে নিচের বাটন টিপে কার্ট এ গিয়ে অর্ডার সম্পন্ন করুন।`;
      } else if (qty >= 20 && priceProposed >= originalPriceNum * 0.8) {
        const finalPrice = Math.floor(priceProposed);
        setAgreedPrice(finalPrice);
        setNegotiatingState('agreed');
        reply = `ঠিক আছে ভাইয়া, ${qty} পিসের মাঝারি অর্ডারের জন্য ৳${finalPrice} রেটটি অনুমোদিত করা হলো। ধন্যবাদ!`;
      } else {
        const counter = Math.floor(originalPriceNum * 0.88);
        reply = `${qty} পিসের জন্য ৳${priceProposed} দামটি রাখা যাচ্ছে না ভাইয়া। সর্বনিম্ন ৳${counter} রেটে প্রসেস করা সম্ভব। যদি একমত হন, কার্ট বাটনে চাপুন অথবা টেক্সট করুন।`;
        setAgreedPrice(counter);
        setNegotiatingState('active');
      }

      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        text: reply,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAddToCartDeal = () => {
    const finalItemPrice = agreedPrice || originalPriceNum;
    const qty = parseInt(targetQuantity) || 1;

    addItem({
      id: `deal-${post.id}-${Date.now()}`,
      name: `[Special B2B Match] ${post.content.slice(0, 35)}... (Qty: ${qty}pcs)`,
      price: finalItemPrice,
      image: post.image,
      portal: 'b2b',
      coinCashback: Math.floor(finalItemPrice * 0.05)
    });

    addNotification(`হোলসেল স্পেশাল ডিলটি ৳${finalItemPrice} মূল্যে আপনার কার্টে যুক্ত করা হয়েছে!`, 'success');
    openCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md px-4">
      {/* Container Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-xl bg-gradient-to-b from-[#14151a] to-[#0d0e12] border-t-2 border-orange-500/30 rounded-t-[36px] flex flex-col h-[85vh] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#17181f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-500">
              {post.sellerName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5 leading-none mb-1">
                {post.sellerName} <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              </h2>
              <p className="text-[10px] text-white/50 leading-none">Instant Wholesaling Desk • Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

        {/* Product Details Header Strip */}
        <div className="p-4 bg-orange-500/5 border-b border-white/5 flex gap-3.5 items-center">
          <img src={post.image} alt={post.content} className="w-12 h-12 object-cover rounded-xl border border-white/10 shadow-md shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/90 font-black truncate leading-tight mb-1">{post.content}</p>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-black text-xs">Regular: {post.price}</span>
              <span className="text-[9px] bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                B2B/হোলসেল বাটন
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Chats Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col hide-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                msg.sender === 'buyer' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed shadow-md ${
                  msg.sender === 'buyer'
                    ? 'bg-orange-500 text-white rounded-tr-none'
                    : 'bg-[#1c1d25] text-white border border-white/5 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[8px] text-white/30 font-medium px-1 mt-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="self-start flex items-center gap-2 bg-[#1c1d25] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Dynamic Negotiation Inputs */}
        <div className="p-4 bg-[#111216] border-t border-white/5 space-y-4">
          {/* Agreed Deal Banner */}
          {agreedPrice !== null && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex flex-col gap-2 shadow-inner"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>দাম ফিক্সড করা হয়েছে: ৳{agreedPrice} (প্রতি পিস)</span>
              </div>
              <div className="flex gap-2 items-center justify-between">
                <span className="text-[10px] text-emerald-400/80 font-bold leading-snug">
                  আপনি এই বিশেষ পাইকারি মূল্যে কার্ট এ যুক্ত করে ডাইরেক্ট চেকআউট করতে পারেন।
                </span>
                <button
                  onClick={handleAddToCartDeal}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/15"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> কার্টে যুক্ত করুন
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick Offer form controller */}
          <form onSubmit={submitQuickOffer} className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 items-end">
            <div className="col-span-1 flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-white/40">পরিমাণ (QTY)</label>
              <input
                type="number"
                min="10"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(e.target.value)}
                placeholder="10"
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-black text-white text-center focus:border-orange-500 outline-none"
              />
            </div>
            
            <div className="col-span-1 flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-white/40">দাম প্রস্তাব (৳)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="৳ দাম"
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-black text-orange-500 text-center focus:border-orange-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="col-span-1 bg-orange-600/90 text-white rounded-xl py-2 text-xs font-black hover:opacity-90 active:scale-95 transition-all text-center h-[34px] flex items-center justify-center"
            >
              অফার পাঠান
            </button>
          </form>

          {/* Text Message Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="আলাপ করুন, যেমন: 'ভাইয়া, ১০ পিস নিব কিছু ছাড় দিন...'"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
