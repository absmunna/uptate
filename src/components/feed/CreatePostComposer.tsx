import * as React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Image as ImageIcon, Package, FileText, PlaySquare,
  Wrench, Send, Store, Layers, DollarSign, Video, AlignLeft, Sparkles
} from "lucide-react";
import {
  useCreatePost,
  useCreateDemand,
  getListPostsQueryKey,
  getListProductsQueryKey,
  getListDemandsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";

type Kind = "status" | "product" | "video" | "deal";

const PRODUCT_PRESET_IMAGES = [
  { label: "Oven Shirt", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
  { label: "Eco Pack", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80" },
  { label: "Tech Gear", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80" },
  { label: "Premium Leather", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" }
];

const VIDEO_PRESET_URLS = [
  { label: "Smart Gadgets Showcase", url: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-green-screen-34204-large.mp4" },
  { label: "Apparel Factory Shoot", url: "https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-working-on-a-garment-40019-large.mp4" },
  { label: "Rural Crafts Promo", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-potter-shaping-a-clay-vase-42861-large.mp4" }
];

export function CreatePostComposer({ isRetailSeller }: { isRetailSeller?: boolean }) {
  const qc = useQueryClient();
  const { user, role } = useAuth();
  const createPost = useCreatePost();
  const createDemand = useCreateDemand();

  // Roles grouping
  const isSellerRole = ["seller", "wholesale", "factory", "digital_seller", "service_provider", "nearby_shop", "rural"].includes(role ?? "");
  const isAdmin = ["admin", "super_admin", "moderator"].includes(role ?? "");

  // Determine allowed post kinds
  // Sellers/Admins get status, product, video
  // Buyers gets status, demand/deal, video
  const defaultKind: Kind = isSellerRole ? "product" : "deal";
  const [kind, setKind] = React.useState<Kind>(defaultKind);

  // Form states
  const [content, setContent] = React.useState("");
  
  // Product specific fields
  const [prodTitle, setProdTitle] = React.useState("");
  const [prodPrice, setProdPrice] = React.useState("");
  const [prodComparePrice, setProdComparePrice] = React.useState("");
  const [prodCategory, setProdCategory] = React.useState("Garments");
  const [prodImageUrl, setProdImageUrl] = React.useState(PRODUCT_PRESET_IMAGES[0].url);

  // Demand specific fields
  const [demandTitle, setDemandTitle] = React.useState("");
  const [demandBudget, setDemandBudget] = React.useState("");
  const [demandCategory, setDemandCategory] = React.useState("Electronics");

  // Video specific fields
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState(VIDEO_PRESET_URLS[0].url);

  const [loading, setLoading] = React.useState(false);

  // Auto set initial kind based on role
  React.useEffect(() => {
    setKind(isSellerRole ? "product" : "deal");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please add a description/caption");
      return;
    }

    setLoading(true);

    try {
      if (kind === "deal") {
        // Post a demand
        if (!demandTitle.trim() || !demandBudget.trim()) {
          toast.error("Please fill in the demand title and budget");
          setLoading(false);
          return;
        }

        await createDemand.mutateAsync({
          data: {
            title: demandTitle.trim(),
            description: content.trim(),
            budget: Number(demandBudget) || 1000,
            category: demandCategory
          }
        });

        toast.success("Demand posted and published to feed");
        // Clear States
        setDemandTitle("");
        setDemandBudget("");
        setContent("");
      } else {
        // Status, Product or Video post
        const payload: any = {
          content: content.trim(),
          type: kind
        };

        if (kind === "product") {
          if (!prodTitle.trim() || !prodPrice.trim()) {
            toast.error("Please fill in the product title and wholesale price");
            setLoading(false);
            return;
          }
          payload.product = {
            title: prodTitle.trim(),
            price: Number(prodPrice) || 0,
            compareAtPrice: prodComparePrice ? Number(prodComparePrice) : undefined,
            category: prodCategory,
            imageUrl: prodImageUrl
          };
        } else if (kind === "video") {
          payload.videoUrl = videoUrl;
          payload.content = `🎥 [Video Content: ${videoTitle || "Story Update"}]\n\n${content.trim()}`;
        }

        await createPost.mutateAsync({ data: payload });
        toast.success("Successfully posted!");
        
        // Clear States
        setContent("");
        setProdTitle("");
        setProdPrice("");
        setProdComparePrice("");
        setVideoTitle("");
      }

      // Invalidate related lists
      qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
      qc.invalidateQueries({ queryKey: getListDemandsQueryKey() });
    } catch (err) {
      toast.error("Could not upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Avatar settings
  const avatarUrl = user?.avatarUrl;
  const initialName = user?.fullName || "User";
  const avatarFallback = initialName?.[0]?.toUpperCase() ?? "U";

  return (
    <GlassCard className="p-5 flex flex-col gap-4 border border-white/10 shadow-lg relative overflow-hidden backdrop-blur-xl">
      {/* Glow Decorative */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 shrink-0 border border-white/15 shadow-sm">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-[var(--pm-surface)] text-cyan-400 font-extrabold">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider leading-none">{initialName}</h4>
            <p className="text-[10px] text-white/40 mt-1 uppercase font-semi bg-white/5 px-2 py-0.5 rounded-full inline-block">
              Posting behavior: {isSellerRole ? "Seller/Wholesale Hub" : "Buyer/Sourcing Desk"}
            </p>
          </div>
        </div>

        {/* Dropdown Options */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-white/40 uppercase mr-1">Post Type:</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            className="bg-[var(--pm-surface)] text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
          >
            {isSellerRole || isAdmin ? (
              <>
                <option value="product">📦 Add Product Showcase</option>
                <option value="video">🎥 Brand Video Story</option>
                <option value="status">💬 General Post / Circle</option>
              </>
            ) : (
              <>
                <option value="deal">📄 Post B2B Demand / Request</option>
                <option value="video">🎥 Product Unboxing Reel</option>
                <option value="status">💬 Normal Update / Query</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Inner Active Forms depending on Kind choice */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title fields depending on Type */}
        {kind === "product" && (
          <div className="grid grid-cols-2 gap-2 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="col-span-2 flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" /> Product Details
            </div>
            
            <div className="col-span-2">
              <label className="text-[10px] text-white/50 block font-medium mb-1">Product Title</label>
              <input
                type="text"
                value={prodTitle}
                onChange={(e) => setProdTitle(e.target.value)}
                placeholder="e.g. Premium Cotton Polo T-Shirt"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block font-medium mb-1">Wholesale Price (৳)</label>
              <input
                type="number"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="৳ Price"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block font-medium mb-1">Compare Price (Optional)</label>
              <input
                type="number"
                value={prodComparePrice}
                onChange={(e) => setProdComparePrice(e.target.value)}
                placeholder="৳ Regular Retail"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-white/50 block font-medium mb-1">Category</label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full bg-[#0d1425] border border-white/8 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              >
                <option value="Garments">Garments (গার্মেন্টস পোশাক)</option>
                <option value="Food">Food & Agro (খাদ্য ও কৃষি)</option>
                <option value="Electronics">Electronics & Gadgets (ইলেকট্রনিক্স)</option>
                <option value="Cosmetics">Cosmetics (প্রসাধন সামগ্রী)</option>
                <option value="Plastic">Plastic & Household (প্লাস্টিক ও গৃহস্থালি)</option>
              </select>
            </div>

            {/* Clickable quick presets */}
            <div className="col-span-2 mt-1">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Tap a preset to assign product image:
              </p>
              <div className="flex gap-2 flex-wrap">
                {PRODUCT_PRESET_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setProdImageUrl(img.url)}
                    className={`text-[9px] px-2 py-1 rounded-md border transition-all ${
                      prodImageUrl === img.url
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-bold"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {kind === "deal" && (
          <div className="grid grid-cols-2 gap-2 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="col-span-2 flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" /> B2B Demand Specifications
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-white/50 block font-medium mb-1">What item/service do you need?</label>
              <input
                type="text"
                value={demandTitle}
                onChange={(e) => setDemandTitle(e.target.value)}
                placeholder="e.g. ৫০০ পিস এক্সপোর্ট টি-শার্ট কটন ১০০%"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block font-medium mb-1">Estimated Budget (৳)</label>
              <input
                type="number"
                value={demandBudget}
                onChange={(e) => setDemandBudget(e.target.value)}
                placeholder="BDT"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block font-medium mb-1">Target Category</label>
              <select
                value={demandCategory}
                onChange={(e) => setDemandCategory(e.target.value)}
                className="w-full bg-[#0d1425] border border-white/8 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              >
                <option value="Garments">Garments (গার্মেন্টস)</option>
                <option value="Food">Food & Agro (খাদ্য ও কৃষি)</option>
                <option value="Electronics">Electronics (ইলেকট্রনিক্স)</option>
                <option value="Services">Professional Services (সেবাসমূহ)</option>
              </select>
            </div>
          </div>
        )}

        {kind === "video" && (
          <div className="grid grid-cols-2 gap-2 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="col-span-2 flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Video className="w-3.5 h-3.5" /> Dynamic Story Reel Details
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-white/50 block font-medium mb-1">Video Title / Hook</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. চকবাজারের সেরা পাইকারি শোরুম ট্যুর!"
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Presets */}
            <div className="col-span-2 my-1">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1 shadow-sm">Select pre-compiled active video story preset:</p>
              <div className="flex flex-col gap-1.5">
                {VIDEO_PRESET_URLS.map((vid) => (
                  <button
                    key={vid.label}
                    type="button"
                    onClick={() => {
                      setVideoUrl(vid.url);
                      setVideoTitle(vid.label);
                    }}
                    className={`text-[9px] text-left px-2.5 py-1.5 rounded-lg border flex items-center justify-between transition-all ${
                      videoUrl === vid.url
                        ? "bg-rose-500/20 text-rose-300 border-rose-400/40 font-bold"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                    }`}
                  >
                    <span>{vid.label}</span>
                    <PlaySquare className="w-3 h-3 text-rose-400/80 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Caption / Content Textarea */}
        <div>
          <label className="text-[10px] text-white/50 block font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <AlignLeft className="w-3 h-3" />
            {kind === "product"
              ? "Product Description / Promotional Caption"
              : kind === "deal"
              ? "Specific Requirements & Release Terms"
              : "Post Caption / Description"}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              kind === "product"
                ? "পণ্যের গুণগত মান, সর্বনিম্ন অর্ডারের সংখ্যা (MOQ) এবং ডেলিভারি সম্পর্কে বিস্তারিত লিখুন..."
                : kind === "deal"
                ? "আপনি কি ধরণের পণ্য খুঁজছেন? আপনার প্রয়োজনীয় সাইজ, কাপড়ের মান বা ডেলিভারি ডেডলাইন এখানে উল্লেখ করুন..."
                : kind === "video"
                ? "ভিডিও নিয়ে আকর্ষনীয় ক্যাপশন লিখুন যা দেখে রিটেইল ক্রেতারা যোগাযোগ করবে..."
                : "পণ্য বা সেবা অনুসন্ধানের জন্য আপনার আপডেট এখানে লিখুন..."
            }
            rows={3}
            className="w-full resize-none bg-[#0a1224] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-all flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {loading ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
