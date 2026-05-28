import React from "react";

// Sellers Types & Mock Data
export interface Seller {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  sellerType: "retail" | "wholesale" | "service" | "content_creator";
}

export const MOCK_SELLERS: Seller[] = [
  {
    id: "s-1",
    name: "রহিম হোলসেল অ্যান্ড ম্যানুফ্যাকচারিং",
    handle: "@rahim_wholesale",
    avatar: "🥬",
    sellerType: "wholesale"
  },
  {
    id: "s-2",
    name: "টেকজোন বিডি (ইউনিক আইটেমস)",
    handle: "@techzone_bd",
    avatar: "🔌",
    sellerType: "retail"
  },
  {
    id: "s-3",
    name: "সেবা বিডি প্রফেশনালস",
    handle: "@sheba_professionals",
    avatar: "🔧",
    sellerType: "service"
  },
  {
    id: "s-4",
    name: "সারা বুটিক অ্যান্ড ফ্যাশন হাউস",
    handle: "@saras_boutique",
    avatar: "👗",
    sellerType: "content_creator"
  }
];

// Posts Types & Mock Data
export interface Post {
  id: string;
  authorId: string;
  type: "Product" | "Service" | "Demand";
  title: string;
  description: string;
  price?: number;
  location?: string;
  rating?: number;
  reviewCount?: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "p-1",
    authorId: "s-1",
    type: "Product",
    title: "অরগানিক সবুজ পালং শাক (পাইকারি অফার)",
    description: "সাভার খামার থেকে সরাসরি সংগৃহীত তাজা পালং শাক। আজই অর্ডার করুন পাইকারি অবিশ্বাস্য দামে! 🥬✨",
    price: 35,
    location: "সাভার, ঢাকা",
    rating: 4.8,
    reviewCount: 45,
    likes: 1250,
    comments: 42,
    isLiked: true
  },
  {
    id: "p-2",
    authorId: "s-2",
    type: "Product",
    title: "স্মার্ট ওয়াচ আল্ট্রা ৯ - ডিসকাউন্ট মেলা",
    description: "নতুন মডেলের আল্ট্রা ৯ ওয়াচ এখন স্টক এ আছে। দারুণ সব ফিচার এবং হেলথ ট্র্যাকার সম্বলিত সেরা বাজেটের গ্যাজেট। ⌚",
    price: 1850,
    location: "জিইসি, চট্টগ্রাম",
    rating: 4.6,
    reviewCount: 18,
    likes: 852,
    comments: 15,
    isLiked: false
  },
  {
    id: "p-3",
    authorId: "s-3",
    type: "Service",
    title: "এসি সার্ভিসিং ও রিপেয়ারিং - প্রো অফার",
    description: "আপনার বাসার এসি ঠান্ডা হচ্ছে না? দক্ষ টেকনিশিয়ান দিয়ে অতি দ্রুত নিখুঁত এসি ওয়াশ এবং গ্যাস চার্জিং সুবিধা। 🛠️",
    price: 1200,
    location: "উপশহর, সিলেট",
    rating: 4.9,
    reviewCount: 32,
    likes: 412,
    comments: 21,
    isLiked: false
  },
  {
    id: "p-4",
    authorId: "s-4",
    type: "Demand",
    title: "৫০০০ পিস সুতি টি-শার্ট লাগবে (কটন ১০০%)",
    description: "রপ্তানি মানসম্পন্ন কটন সুতি টি-শার্টের জরুরি অর্ডার। উপযুক্ত দাম ও নিখুঁত ফিনিশিং এর জন্য সরাসরি কারখানার মালিকদের সাথে যোগাযোগ করতে চাচ্ছি।",
    price: 120,
    location: "উত্তরা, ঢাকা",
    rating: 4.5,
    reviewCount: 7,
    likes: 310,
    comments: 54,
    isLiked: true
  }
];

// Helper to format prices
export function formatPrice(price: number): string {
  return `৳ ${price.toLocaleString()}`;
}
