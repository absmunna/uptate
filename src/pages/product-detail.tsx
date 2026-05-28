import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProduct, getGetProductQueryKey, useAddToCart, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { 
  ShoppingCart, Star, Minus, Plus, Share2, Heart, ArrowLeft, 
  MapPin, BadgeCheck, ShieldCheck, CheckCircle2, Award, Users, 
  Calendar, Flame, MessageSquare, HelpCircle, FileText, Info 
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"reviews" | "questions" | "comments">("reviews");
  const [isSaved, setIsSaved] = useState(false);

  const { data: product } = useGetProduct(id, { query: { queryKey: getGetProductQueryKey(id), enabled: !!id } });
  const { data: relatedProducts } = useListProducts(
    { categoryId: product?.categoryId, limit: 5 },
    { query: { queryKey: getListProductsQueryKey({ categoryId: product?.categoryId, limit: 5 }), enabled: !!product?.categoryId } }
  );

  const addToCart = useAddToCart();

  if (!product) return <div className="p-8 text-center text-white font-mono">Loading product information...</div>;

  // Derive Type/Mode for polymorphing
  const isB2B = product.type === "wholesale" || product.type === "factory_direct";
  const isFactory = product.type === "factory_direct";
  const isService = product.type === "service" || product.type === "digital_service";

  // Normalize structure defensively
  const images = Array.isArray(product.images)
    ? product.images
    : (typeof product.image === "string" ? [product.image] : []);

  const categoryName = (typeof product.category === "object" ? product.category?.name : product.category) || "General";

  const productVendor = product.vendor || {
    id: product.sellerId || "default-vendor",
    name: product.vendorName || "Paikar Partner Store",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(product.vendorName || "PP")}`
  };

  const handleAddToCart = () => {
    addToCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        toast.success(`Added ${quantity} ${product.title} to cart`);
        qc.invalidateQueries({ queryKey: ["/api/cart"] });
      }
    });
  };

  const handleBuyNow = () => {
    addToCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/cart"] });
        navigate("/cart");
      }
    });
  };

  const handleRequestQuote = () => {
    toast.success("Quotation request submitted to vendor! They will contact you shortly.");
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved items" : "Added to saved items");
  };

  const handleShare = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard");
      } else { throw new Error(); }
    } catch {
       const input = document.createElement('input');
       input.value = window.location.href;
       document.body.appendChild(input);
       input.select();
       document.execCommand('copy');
       document.body.removeChild(input);
       toast.success("Product link copied (fallback)");
    }
  };

  // Mocked rich data adhering to SOCIAL COMMERCE & TRUST indicators
  const trustScores = {
    verified: true,
    completedOrders: 1450,
    responseRate: "98%",
    followers: "12.4k",
    yearsActive: "4 Years",
    factoryBadge: isFactory || isB2B,
    exporterBadge: isFactory || isB2B,
  };

  const socialCommerceData = {
    trendingScore: 9.8,
    viralityBadge: "🔥 Top Viral",
    peoplePurchased: 480,
    peopleSaved: 1240,
    recentActivity: "12 people purchased in last 2 hours"
  };

  return (
    <div className="flex flex-col gap-8 pb-32 min-h-screen text-[var(--pm-text)] bg-[var(--pm-bg)] font-sans">
      
      {/* ━━━ TOP BREADCRUMB / BACK ACTON ━━━ */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pt-4">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Marketplace</span>
        </Link>
      </div>

      {/* ━━━ MAIN GRID CONTAINER ━━━ */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT AREA: MEDIA GALLERY GALLERY (7 COLUMNS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-square md:max-h-[720px] bg-[var(--pm-surface)] rounded-[20px] overflow-hidden border border-white/5 relative group select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            <img 
              src={images[activeImage] ?? ''} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* Float Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="h-[28px] px-3 rounded-full bg-cyan-400/20 text-cyan-400 backdrop-blur-md border border-cyan-400/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" /> {socialCommerceData.viralityBadge}
              </span>
              <span className="h-[28px] px-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center">
                Score: {socialCommerceData.trendingScore}
              </span>
            </div>

            {/* Float Action Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button 
                onClick={handleSaveToggle}
                variant="secondary" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all"
              >
                <Heart className={cn("w-5 h-5 transition-colors", isSaved ? "text-rose-500 fill-rose-500" : "text-white")} />
              </Button>
              <Button 
                onClick={handleShare}
                variant="secondary" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all"
              >
                <Share2 className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-[88px] h-[88px] rounded-xl overflow-hidden shrink-0 border-2 transition-all relative",
                    activeImage === idx ? "border-cyan-400 opacity-100 scale-95" : "border-white/5 opacity-40 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT AREA: PRODUCT INFO & CHECKOUT PANEL (5 COLUMNS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Header information */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-xs font-semibold capitalize tracking-wider h-[32px] flex items-center">
                {(product.type || "retail").replace('_', ' ')}
              </span>
              <span className="text-gray-400 text-sm">{categoryName}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight line-clamp-3">
              {product.title}
            </h1>
            
            {/* Meta statistics & location */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/5 px-2.5 py-1 rounded-lg border border-yellow-500/10">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-yellow-400">{(product.rating || 0).toFixed(1)}</span>
                <span className="text-gray-500 text-xs">({product.reviewCount || 0} reviews)</span>
              </div>
              <div className={cn(
                "font-semibold px-2.5 py-1 rounded-lg border text-xs h-[32px] flex items-center",
                product.stock > 0 
                  ? "text-emerald-400 bg-emerald-500/5 border-emerald-400/10" 
                  : "text-rose-400 bg-rose-500/5 border-rose-400/10"
              )}>
                {product.stock > 0 ? `Stock: ${product.stock} items` : "Out of Stock"}
              </div>
              <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300 text-xs">{product.location || "Dhaka, BD"}</span>
              </div>
            </div>
          </div>

          {/* Social Stats Pulse Box */}
          <div className="bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-[16px] text-xs flex flex-col gap-1.5 text-cyan-200">
            <div className="flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>{socialCommerceData.recentActivity}</span>
            </div>
            <div className="text-gray-400 flex gap-4 text-[11px]">
              <span>👥 {socialCommerceData.peoplePurchased} purchased</span>
              <span>⭐ {socialCommerceData.peopleSaved} saved interest</span>
            </div>
          </div>

          {/* Formatted Price and compares */}
          <div className="flex items-end gap-3 py-3 border-y border-white/5">
            <span className="text-3xl font-bold text-cyan-400 tracking-tight font-mono">
              {formatBDT(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-500 line-through mb-1 font-mono">
                {formatBDT(product.compareAtPrice)}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15 mb-1.5">
                -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Description summary */}
          <div className="text-gray-300 text-sm leading-relaxed max-h-[160px] overflow-y-auto pr-2">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* ━━━ TRUST CERTIFICATES PANEL ━━━ */}
          <div className="p-4 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Trusted Vendor Guarantee
            </h3>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-gray-400 font-medium">Rating</span>
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-0.5">
                  ⭐ {(product.rating || 0).toFixed(1)}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-gray-400 font-medium">Completed</span>
                <span className="text-xs font-bold text-white">+{trustScores.completedOrders}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-gray-400 font-medium">Response</span>
                <span className="text-xs font-bold text-cyan-400">{trustScores.responseRate}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-gray-400 font-medium">Followers</span>
                <span className="text-xs font-bold text-white">{trustScores.followers}</span>
              </div>
            </div>

            {/* Special Trust Certifications Overlays */}
            <div className="flex gap-2 flex-wrap mt-1">
              {trustScores.verified && (
                <span className="px-2 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold text-cyan-400 flex items-center gap-1 uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5 fill-current text-[var(--pm-bg)]" /> Verified Merchant
                </span>
              )}
              {trustScores.factoryBadge && (
                <span className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 flex items-center gap-1 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Certified Factory Source
                </span>
              )}
              {trustScores.exporterBadge && (
                <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Licensed Exporter
                </span>
              )}
            </div>
          </div>

          {/* VENDOR STOREFRONT MINICARD */}
          {productVendor && (
            <Link to={`/vendors/${productVendor.id}`}>
              <GlassCard className="p-4 flex items-center justify-between hover:border-cyan-400/30 transition-all cursor-pointer group rounded-xl">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-white/10">
                    <AvatarImage src={productVendor.avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-cyan-950 font-bold text-cyan-400">
                      {productVendor.name?.[0] || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                      {productVendor.name}
                      <BadgeCheck className="w-4 h-4 text-cyan-400" />
                    </h4>
                    <p className="text-xs text-gray-400">{product.location || "Dhaka, Bangladesh"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-400 text-xs hover:bg-cyan-400/10">
                  Visit Store
                </Button>
              </GlassCard>
            </Link>
          )}

          {/* ━━━ QUANTITY STEPPER & ACTION FLOW ━━━ */}
          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium">Quantity</span>
              
              <div className="flex items-center bg-[var(--pm-surface)] rounded-xl border border-white/5 h-12 w-fit">
                <button 
                  className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-l-xl transition-colors disabled:opacity-30"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white font-mono">{quantity}</span>
                <button 
                  className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-r-xl transition-colors disabled:opacity-30"
                  onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  disabled={quantity >= (product.stock || 999)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sticky Actions Stack (Height 52px each) */}
            <div className="flex flex-col md:flex-row gap-3 mt-2">
              {isB2B || isFactory ? (
                <>
                  <button 
                    onClick={handleRequestQuote}
                    className="flex-1 h-[52px] rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5" /> Request Bulk Quote
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-[52px] rounded-xl bg-[var(--pm-surface)] border border-white/10 hover:border-cyan-400/30 text-white font-bold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ShoppingCart className="w-5 h-5 text-cyan-400" /> Add to Sourcing Cart
                  </button>
                </>
              ) : isService ? (
                <>
                  <button 
                    onClick={handleRequestQuote}
                    className="flex-1 h-[52px] rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <Calendar className="w-5 h-5" /> Book Service Appointment
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 h-[52px] rounded-xl bg-[var(--pm-surface)] border border-white/10 hover:border-cyan-400/30 text-white font-bold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <MessageSquare className="w-5 h-5 text-cyan-400" /> Consult Provider
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-[52px] rounded-xl bg-[var(--pm-surface)] border border-white/10 hover:border-cyan-500 text-white hover:bg-white/[0.02] font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ShoppingCart className="w-5 h-5 text-cyan-400" /> Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 h-[52px] rounded-xl bg-cyan-400 hover:bg-cyan-500 text-[var(--pm-bg)] font-extrabold flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    ⚡ Buy Now
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ━━━ DISCUSSION AREA: TABS REVIEWS, QUESTIONS, COMMENTS ━━━ */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-12 py-8 border-t border-white/5">
        
        {/* Navigation Tabs (Height 48px, Gap 24px) */}
        <div className="flex gap-6 border-b border-white/5 h-[48px] items-center mb-8 relative">
          <button 
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "text-base font-bold pb-2 relative transition-all duration-200",
              activeTab === "reviews" ? "text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            Reviews ⭐
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("questions")}
            className={cn(
              "text-base font-bold pb-2 relative transition-all duration-200",
              activeTab === "questions" ? "text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            Buyer Q&A ❓
            {activeTab === "questions" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("comments")}
            className={cn(
              "text-base font-bold pb-2 relative transition-all duration-200",
              activeTab === "comments" ? "text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            Comments 💬
            {activeTab === "comments" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab display viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Tab View Layout */}
          {activeTab === "reviews" && (
            <>
              {/* Reviews List column (8 columns on Desktop) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" />
                        <AvatarFallback>NM</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm text-white">Nirjon Munna</h4>
                        <span className="h-6 px-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-[10px] uppercase font-bold tracking-wider inline-flex items-center">
                          ✓ Verified Buyer
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    "চমৎকার কোয়ালিটি! ডেলিভারি অনেক ফাস্ট ছিল। বিক্রেতার ব্যবহারের প্রশংসা করতে হয়। প্রোডাক্ট একদম সঠিক সময়ে পেয়েছি।"
                  </p>
                  <div className="flex gap-2.5 mt-2">
                    <img 
                      src={images[0] ?? ''} 
                      alt="customer attach" 
                      className="w-[120px] h-[120px] object-cover rounded-[20px] border border-white/10 shadow-md transform hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" />
                        <AvatarFallback>MH</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm text-white">Mahmudul Hasan</h4>
                        <span className="h-6 px-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-[10px] uppercase font-bold tracking-wider inline-flex items-center">
                          ✓ Verified Buyer
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      <Star className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    "বিটুবি হোলসেল রেট এবং প্যাকেজিং দারুণ লেগেছে। আমরা বড় অর্ডারের আগে স্যাম্পল হিসেবে নিয়েছিলাম, এখন ডিরেক্ট কন্টেইনার সোর্সিং করব।"
                  </p>
                </div>
              </div>

              {/* Review summary stats card (4 columns on Desktop) */}
              <div className="lg:col-span-4 p-6 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-3">Average Reviews Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white font-mono">{(product.rating || 0).toFixed(1)}</span>
                    <span className="text-lg text-gray-500 font-mono">/ 5.0</span>
                  </div>
                  <div className="flex gap-1.5 text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Based on {product.reviewCount} customer feedbacks</p>
                </div>

                {/* Rating bars */}
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stars === 5 ? "85%" : stars === 4 ? "10%" : "5%";
                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-gray-400">{stars}</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 shrink-0" />
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: pct }}></div>
                        </div>
                        <span className="w-8 text-right text-gray-500">{pct}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === "questions" && (
            <div className="lg:col-span-12 flex flex-col gap-4 w-full">
              {/* Question 1 */}
              <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold">Q</div>
                  <div>
                    <span className="text-sm font-bold text-white">"এই প্রোডাক্টটি কি ওয়াটারপ্রুফ নাকি সাধারণ বৃষ্টি সহ্য করতে পারে?"</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Asked by Abir Hossain • Verified Buyer</p>
                  </div>
                </div>

                {/* Highlighted left border seller answer */}
                <div className="p-4 bg-white/[0.02] border-l-4 border-l-cyan-400 rounded-r-xl text-sm flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Seller Answer</span>
                    <span className="text-[11px] text-gray-500">Mayer Doa Enterprise • 12 mins ago</span>
                  </div>
                  <p className="text-gray-300 font-sans leading-relaxed">
                    "জি, এটি ১০০% ওয়াটারপ্রুফ এবং প্রলেপযুক্ত। মোটরসাইকেল রাইডারদের জন্য বৃষ্টিতে রাইড করার জন্য এটি সর্বোত্তম পছন্দ।"
                  </p>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold">Q</div>
                  <div>
                    <span className="text-sm font-bold text-white">"হোলসেল ১০০০ পিস নিতে চাইলে লিড টাইম কতদিন লাগতে পারে?"</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Asked by Jamil Traders • Wholesale Merchant</p>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border-l-4 border-l-cyan-400 rounded-r-xl text-sm flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Seller Answer</span>
                    <span className="text-[11px] text-gray-500">Mayer Doa Enterprise • 3 hours ago</span>
                  </div>
                  <p className="text-gray-300 font-sans leading-relaxed">
                    "১০০০ পিস ডেলিভারির জন্য আমাদের কারখানায় ৩-৫ দিন সময় লাগবে। আপনি সরাসরি Quotation ফর্মে রিকুয়েস্ট সাবমিট করতে পারেন।"
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="lg:col-span-12 flex flex-col gap-4 w-full">
              <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-white/5 rounded-xl border border-white/5 px-4 py-3 text-sm text-gray-300 leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">Salma Neha</span>
                      <span className="text-[10px] text-gray-500">2 hours ago</span>
                    </div>
                    এই ডিজাইনটা অনেক চমৎকার লেগেছে! খুব শীঘ্রই এটা আমার কালেকশনে যুক্ত করব।
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ━━━ RELATED PRODUCTS (4 Columns on Desktop, 3 on Tablet, 2 on Mobile) ━━━ */}
      {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-12 pt-12 border-t border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span className="h-5 w-1 bg-cyan-400 rounded-full"></span> Recommended Products For You
            </h2>
            <Link to="/marketplace" className="text-cyan-400 hover:text-cyan-500 text-sm font-medium">
              View All
            </Link>
          </div>
          <ProductGrid products={relatedProducts.filter((p: any) => p && p.id !== product.id).slice(0, 4)} />
        </div>
      )}

      {/* ━━━ STICKY BOTTOM BUTTONS FOR MOBILE VIEWPORTS ONLY ━━━ */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--pm-bg)]/90 border-t border-white/10 flex items-center px-4 md:hidden z-50 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 h-11 bg-[var(--pm-surface)] border-white/10 hover:bg-white/5 text-white rounded-xl text-sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button 
            className="flex-1 h-11 bg-cyan-400 hover:bg-cyan-500 text-black text-sm font-bold rounded-xl"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>

    </div>
  );
}
