import { B2BProduct, B2BVendor, RFQ, B2BPost } from '../types/b2bTypes';

export const B2B_CATEGORIES = [
  { id: 'garments', label: 'Garments', labelBn: 'তৈরি পোশাক ও ফেব্রিক্স', icon: 'Shirt', count: '২৫০+ মিল' },
  { id: 'agro', label: 'Agro', labelBn: 'কৃষি ও খাদ্য পণ্য', icon: 'Sprout', count: '১৮০+ আড়তকারী' },
  { id: 'electronics', label: 'Electronics', labelBn: 'ইলেকট্রনিক্স ও গ্যাজেট', icon: 'Cpu', count: '১২০+ প্রস্তুতকারক' },
  { id: 'machinery', label: 'Machinery', labelBn: 'ইন্ডাস্ট্রিয়াল যন্ত্রপাতি', icon: 'Settings', count: '৯৫+ আমদানিকারক' },
  { id: 'construction', label: 'Construction', labelBn: 'নির্মাণ সামগ্রী ও স্টিল', icon: 'HardHat', count: '১১০+ কোম্পানি' },
  { id: 'furniture', label: 'Furniture', labelBn: 'ফার্নিচার ও কাঠ', icon: 'Armchair', count: '৮০+ রাইস মিল ও কারখানা' },
  { id: 'auto-parts', label: 'Auto Parts', labelBn: 'অটো পার্টস ও লুব্রিকেন্ট', icon: 'Wrench', count: '৭৫+ বিক্রেতা' },
];

export const MOCK_B2B_VENDORS: B2BVendor[] = [
  {
    id: 'f-1',
    name: 'Narayanganj Knitwear & Textile Ltd (নারায়ণগঞ্জ নিটওয়্যার)',
    type: 'factory',
    isVerified: true,
    rating: 4.8,
    location: 'Kanchpur Industrial Zone, Narayanganj',
    banner: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=150&auto=format&fit=crop',
    industry: 'Garments',
    description: 'We specialize in export-grade jersey knit, cotton t-shirts, activewear production, and yarn spinning since 2008. Certified by OEKO-TEX and GOTS.',
    employeeCount: 1600,
    establishedYear: 2008,
    exportMarkets: ['Germany', 'USA', 'Italy', 'UK', 'Spain'],
    certifications: ['OEKO-TEX Standard 100', 'GOTS Organic Cert', 'BSCI Audited'],
  },
  {
    id: 'f-2',
    name: 'Savar Agro-Processing Industries (সাভার এগ্রো অ্যান্ড ফ্রুটস)',
    type: 'exporter',
    isVerified: true,
    rating: 4.6,
    location: 'Savar BSCIC, Dhaka',
    banner: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=150&auto=format&fit=crop',
    industry: 'Agro',
    description: 'Largest bulk cold-chain storage and organic mango, potato, and spice processing plant in Savar. Exporting premium agricultural goods under government subsidies.',
    employeeCount: 450,
    establishedYear: 2014,
    exportMarkets: ['Saudi Arabia', 'UAE', 'Malaysia', 'Singapore'],
    certifications: ['HALAL Certified', 'ISO 22000', 'HACCP Foods'],
  },
  {
    id: 'f-3',
    name: 'Gazipur Smart-Tech Assembling Line (গাজীপুর স্মার্ট-টেক পার্টস)',
    type: 'factory',
    isVerified: true,
    rating: 4.7,
    location: 'Konabari, Gazipur',
    banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop',
    industry: 'Electronics',
    description: 'Direct manufacturer of circuit boards, smart LED bulb modules, home appliance PCB assembly, and premium voltage stabilizers.',
    employeeCount: 780,
    establishedYear: 2017,
    exportMarkets: ['India', 'Vietnam', 'Turkey'],
    certifications: ['CE Mark', 'ISO 9001:2015', 'RoHS Compliance'],
  },
  {
    id: 's-4',
    name: 'Khatunganj Trading & Spice Importers (চাটগাঁ মসলা ট্রেডিং)',
    type: 'importer',
    isVerified: true,
    rating: 4.5,
    location: 'Khatunganj Wholesale Area, Chattogram',
    banner: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop',
    industry: 'Agro',
    description: 'Bulk importer of premium cardamoms, cinnamon, dry ginger, and garlic from Indonesia, Brazil, and Vietnam. Serving wholesalers nationwide.',
    employeeCount: 120,
    establishedYear: 1999,
    exportMarkets: ['Bangladesh Nationwide Distribution'],
    certifications: ['BSTI Standard Food Clearance', 'Customs Import License'],
  },
  {
    id: 's-5',
    name: 'Islampur Textile Brokerage & Fabrics (ইসলামপুর ফ্যাব্রিক সোর্স)',
    type: 'supplier',
    isVerified: false,
    rating: 4.4,
    location: 'Islampur Wholesale Market, Old Dhaka',
    banner: 'https://images.unsplash.com/photo-1524295981997-ec4f540702e5?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop',
    industry: 'Garments',
    description: 'Bulk supplier of premium local silk, cotton voile, print fabric rolls, and traditional Bangladeshi lungi and sharees directly from tat (loom) mills.',
    employeeCount: 85,
    establishedYear: 2011,
    exportMarkets: ['Local Wholesalers'],
    certifications: ['Dhaka Merchant Association Trade License'],
  }
];

export const MOCK_B2B_PRODUCTS: B2BProduct[] = [
  {
    id: 'bp-1',
    name: '১০০% সুতি জ্যাকার্ড ফেব্রিক রোল (রঙিন ডিজাইনার লট)',
    category: 'garments',
    moq: 150,
    stock: 25000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop',
    vendorId: 'f-1',
    vendorName: 'Narayanganj Knitwear & Textile Ltd',
    isVerified: true,
    isExport: true,
    rating: 4.8,
    description: '১০০% কম্বড কাটন জ্যাকার্ড উইভিং রোল। প্রডিউসড ফর কাস্টম গার্মেন্টস এক্সপোর্ট ব্রেশার্স। চমৎকার স্থায়িত্ব এবং রং ফাঁকিহীন গ্যারান্টি।',
    specs: {
      'উপাদান (Composition)': '105% Organic Combed Cotton',
      'জিএসএম (GSM)': '180-220 GSM Premium Soft',
      'প্রস্থ (Width)': '60/62 Inches Standard Roll',
      'প্যাকেজিং (Packaging)': 'Double PVC Water-resistant Cylinder'
    },
    tierPrices: [
      { range: '150 - 499 গজ', price: 185 },
      { range: '500 - 1999 গজ', price: 172 },
      { range: '২০০০+ গজ', price: 158 }
    ]
  },
  {
    id: 'bp-2',
    name: 'এক্সপোর্ট গ্রেড সলিড হুট গোল্ডেন জুট বাইন্ডিং ব্যাগ',
    category: 'garments',
    moq: 500,
    stock: 120000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop',
    vendorId: 'f-2',
    vendorName: 'Savar Agro-Processing Industries',
    isVerified: true,
    isExport: true,
    rating: 4.6,
    description: 'পরিবেশ বান্ধব শতভাগ জুট দিয়ে তৈরি হ্যান্ডেল সহ ভারী শপিং ব্যাগ। ইউরোপীয় মার্কেটের জন্য বিশেষভাবে ডিজাইনকৃত ক্যাচ পলিশ সম্পন্ন।',
    specs: {
      'উপাদান (Material)': 'Natural Bangladesh Grade-A Jute',
      'সাইজ (Size)': '14 x 16 x 5 inches with soft handle',
      'ক্যাপাসিটি (Capacity)': 'Holds up to 15 KG weight'
    },
    tierPrices: [
      { range: '500 - 999 পিস', price: 85 },
      { range: '1000 - 4999 পিস', price: 78 },
      { range: '৫০০০+ পিস', price: 68 }
    ]
  },
  {
    id: 'bp-3',
    name: 'স্মার্ট স্মার্ট-টেক আলট্রা ভোল্টেজ স্টেবিলাইজার PCB বোর্ড',
    category: 'electronics',
    moq: 50,
    stock: 4500,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop',
    vendorId: 'f-3',
    vendorName: 'Gazipur Smart-Tech Assembling Line',
    isVerified: true,
    isExport: false,
    rating: 4.7,
    description: 'হাই-ইফিসিয়েন্সি মাইক্রো চিপসেট চালিত ভোল্টেজ স্টেবিলাইজার প্রিন্টেড সার্কিট বোর্ড। ডমেস্টিক ও রিটেইল ফ্রিজ-টিভি স্টেবিলাইজারের জন্য সেরা।',
    specs: {
      'ইনপুট ভোল্টেজ (Input)': '140V - 260V range converter',
      'আউটপুট ফ্রিকোয়েন্সি (Freq)': '50Hz Smart Wave Auto Shield',
      'সুরক্ষা (Protection)': 'Short-Circuit & Over-heat Cutoff'
    },
    tierPrices: [
      { range: '50 - 199 কার্টন', price: 650 },
      { range: '200 - 499 কার্টন', price: 580 },
      { range: '৫০০+ কার্টন', price: 520 }
    ]
  },
  {
    id: 'bp-4',
    name: 'আমদানিকৃত ভিয়েতনামি গোল মরিচ লট (Black Pepper Bulk)',
    category: 'agro',
    moq: 100,
    stock: 15000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
    vendorId: 's-4',
    vendorName: 'Khatunganj Trading & Spice Importers',
    isVerified: true,
    isExport: false,
    rating: 4.5,
    description: 'ভিয়েতনাম থেকে আমদানি করা বড় দানার সুগন্ধি কালো গোলমরিচ। চাটগাঁ পোর্টে কাস্টমস ছাড় পাওয়া ১০০% ক্ষতিকারক কেমিক্যালমুক্ত লট।',
    specs: {
      'উৎপত্তি (Origin)': 'Vietnam Premium Hill Reserves',
      'গ্রেড (Grade)': 'Grade A Double Washed Spices',
      'প্যাকিং (Packing)': '50 KG jute sacks with inner plastic shield'
    },
    tierPrices: [
      { range: '100 - 499 কেজি', price: 420 },
      { range: '500 - 999 কেজি', price: 395 },
      { range: '১০০০+ কেজি', price: 375 }
    ]
  },
  {
    id: 'bp-5',
    name: 'ইসলামপুরী সুতি প্রিণ্ট থান ভয়েল (ডাবল লট কাপল থ্রি-পিস রোল)',
    category: 'garments',
    moq: 200,
    stock: 8000,
    image: 'https://images.unsplash.com/photo-1524295981997-ec4f540702e5?w=400&auto=format&fit=crop',
    vendorId: 's-5',
    vendorName: 'Islampur Textile Brokerage & Fabrics',
    isVerified: false,
    isExport: false,
    rating: 4.4,
    description: 'ঐতিহ্যবাহী ইসলামপুরের জনপ্রিয় কটন ভয়েল ফেব্রিক রোলস। রিটেইল দোকানে পাইকারি কাটার জন্য এবং বুটিক ডিজাইনারদের কাস্টম মেটেরিয়াল হিসেবে আইডিয়াল।',
    specs: {
      'মেটেরিয়াল (Material)': '80% Soft Local Cotton & Polyester Blend',
      'দৈর্ঘ্য (Length)': '120 Gaz (Yards) per bundle pack'
    },
    tierPrices: [
      { range: '200 - 499 গজ', price: 120 },
      { range: '500 - 999 গজ', price: 112 },
      { range: '১০০০+ গজ', price: 95 }
    ]
  }
];

export const MOCK_B2B_RFQS: RFQ[] = [
  {
    id: 'rfq-1',
    title: '১০,০০০ পিস জেন্টস কটন পলো শার্ট মেকিং ও সাপ্লাই',
    category: 'garments',
    quantity: 10000,
    unit: 'পিস (Pcs)',
    budget: '৳ ১৩০ - ১৫০ /পিস',
    deadline: '২০২৬-০৮-১৫',
    description: 'আমাদের কর্পোরেট ক্যাম্পেইনের জন্য ১০,০০০ পিস পিকে ওয়াশ কটন পলো শার্ট প্রয়োজন। লোগো এ্যাম্ব্রয়ডারি কোয়ালিটি অত্যন্ত নিখুঁত হতে হবে। সরাসরি গার্মেন্টস ফ্যাক্টরির প্রোডাকশন টিম বিড করুন। নমুনা জমা দান আবশ্যক।',
    buyerName: 'রেড কর্পোরেট এজেন্সী লি.',
    buyerRegion: 'Gulshan-2, Dhaka',
    isUrgent: true,
    status: 'Open',
    date: '২০২৬-০৫-২৫',
    quotes: [
      { id: 'q-1', companyName: 'Narayanganj Knitwear Ltd', quotePrice: 135, deliveryTime: '২৫ দিন', message: 'আমরা এই বাজেটে বেস্ট পিকে ফেব্রিক্স দিয়ে কাজ করতে প্রস্তুত। ওয়েকো-টেক্স হ্যান্ডেল সার্টিফিকেট যুক্ত করা হলো।', date: '২০২৬-০৫-২৬' }
    ]
  },
  {
    id: 'rfq-2',
    title: '৫ টন শুকনো লাল মরিচ গুড়ো (Premium Chilli Powder)',
    category: 'agro',
    quantity: 5000,
    unit: 'কেজি (Kg)',
    budget: '৳ ২৪০ - ২৬০ /কেজি',
    deadline: '২০২৬-০৭-০১',
    description: 'ফুড গ্রেড প্যাকেজিং সহ হাই-ক্যাপাসিটি ক্যাপসাইসিন কোয়ালিটির লাল মরিচ গুড়ো পাইকারি সোর্সিং প্রয়োজন। চট্টগ্রামের খাতুনগঞ্জ বা সোনামসজিদ ল্যান্ডপোর্ট এলাকার কোনো বায়ার/ইম্পোর্টার এভেলেবল থাকলে দ্রুত কোট করুন।',
    buyerName: 'প্রানপ্রিয়া এগ্রো ফুডস লি.',
    buyerRegion: 'Tejgaon, Dhaka',
    status: 'Open',
    date: '২০`২৬-০৫-২৪',
    quotes: []
  },
  {
    id: 'rfq-3',
    title: '১০০০ পিস রিচার্জেবল ১৫ ওয়াট এলইডি বাল্ব সার্কিট',
    category: 'electronics',
    quantity: 1000,
    unit: 'পিস (Pcs)',
    budget: '৳ ৯০ - ১০৫ /পিস',
    deadline: '২০২৬-০৬-৩০',
    description: 'ক্যাপাসিটর এবং অটো চার্জিং প্রটেকশন আইসি সহ ১৫ ওয়াটের ট্রাভেল এলইডি লটের জন্য বিড চাচ্ছি। দীর্ঘস্থায়ী ব্যাটারি পিন কানেক্টর থাকতে হবে। দ্রুত ডেলিভারি চাই।',
    buyerName: 'মেসার্স ভাই ভাই ইলেকট্রিক',
    buyerRegion: 'Nawabpur, Old Dhaka',
    status: 'Open',
    date: '২০২৬-০custom-০৫-২৩',
    quotes: []
  }
];

export const MOCK_B2B_POSTS: B2BPost[] = [
  {
    id: 'bp-101',
    authorName: 'সিলসিলা স্পিনিং অ্যান্ড উইভিং মিলস',
    authorRole: 'Factory Owner (Konabari)',
    authorLogo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop',
    type: 'product_launch',
    title: 'নতুন লঞ্চ: এক্সপোর্ট কটন ডেনিম টুইল ফেব্রিক্স (১২ আউন্স)',
    content: 'সুসংবাদ! আমাদের গাজীপুর প্ল্যান্টে সম্পূর্ণ অটোমেটিক লুমে তৈরি ১২ আউন্সের ডেনিম ফেব্রিক্সের ফার্স্ট রান লট স্টক রেডি। ১০০% ইন্ডিকো ডাই সম্পন্ন। মিনিমাম অর্ডার ৫০ রোলস (২০০০ গজ)। কাস্টম সোর্সিং এবং ওযার্স ডাই কাস্টমাইজেশন করা যাবে। আগ্রহী পাইকার ও মার্চেন্ডাইজারগণ দ্রুত ইনবক্স করুন।',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    likes: 42,
    comments: 18,
    date: '৪ ঘণ্টা আগে'
  },
  {
    id: 'bp-102',
    authorName: 'চাটগাঁ মসলা ট্রেডিং লিমিটেড',
    authorRole: 'Bulk Importer (Khatunganj)',
    authorLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop',
    type: 'bulk_offer',
    title: 'স্টক ক্লিয়ারেন্স ডিসকাউন্ট: ৪ টন শুকনো এলাচ লট আজই খালাস',
    content: 'খালাস রেডি! ভিয়েতনামি গ্রেড-১ এলাচ (Green Cardamom 8mm) এর শেষ ৪ টনের একটি লট আজই খাতুনগঞ্জ ওয়্যারহাউস থেকে ক্যাশ অন ডেলিভারি মোডে রিলিজ করা হবে। কোনো আড়তদার বা বড় আমদানিকারক ভাই একসাথে পুরো লট নিলে বিশেষ লিকুইডেশন ডিসকাউন্ট দেওয়া হবে। MOQ ৫00 কেজি!',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop',
    likes: 29,
    comments: 7,
    date: '১০ ঘণ্টা আগে'
  }
];
