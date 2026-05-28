import * as React from "react";
import { Link } from "react-router-dom";
import { Plus, Play } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { MiniSpotlight } from "@/components/home/HeroSpotlight";

type Story = {
  id: string;
  user: string;
  label: string;
  image: string;
  live?: boolean;
  ring: string;
};

const STORIES: Story[] = [
  {
    id: "s1",
    user: "Rahim Traders",
    label: "New Fabric Arrival",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&q=80",
    live: true,
    ring: "from-pink-500 to-orange-400",
  },
  {
    id: "s2",
    user: "BD Electronics",
    label: "Flash Deals 🔥",
    image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=220&q=80",
    ring: "from-cyan-400 to-blue-500",
  },
  {
    id: "s3",
    user: "Hilsha Market",
    label: "Fresh Catch Today",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=220&q=80",
    live: true,
    ring: "from-emerald-400 to-teal-500",
  },
  {
    id: "s4",
    user: "Dhaka Fashion",
    label: "Eid Collection",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=220&q=80",
    ring: "from-purple-400 to-pink-500",
  },
  {
    id: "s5",
    user: "Agro Direct",
    label: "Farm Fresh 🌿",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&q=80",
    ring: "from-lime-400 to-green-500",
  },
  {
    id: "s6",
    user: "Tech Zone BD",
    label: "Phones & Gadgets",
    image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=220&q=80",
    ring: "from-blue-400 to-indigo-500",
  },
  {
    id: "s7",
    user: "Sweet Corner",
    label: "Mishti & Snacks",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=220&q=80",
    ring: "from-amber-400 to-orange-500",
  },
  {
    id: "s8",
    user: "Khatunganj B2B",
    label: "Wholesale Bulk",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&q=80",
    live: true,
    ring: "from-rose-400 to-red-500",
  },
];

const RETAIL_STORIES: Story[] = [
  {
    id: "rs1",
    user: "Fashion BD",
    label: "Winter Sale",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&q=80",
    live: true,
    ring: "from-pink-500 to-orange-400",
  },
  {
    id: "rs2",
    user: "Gadget Hub",
    label: "Smartphones",
    image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=220&q=80",
    ring: "from-cyan-400 to-blue-500",
  },
  {
    id: "rs3",
    user: "Home Decor",
    label: "Furniture",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&q=80",
    ring: "from-emerald-400 to-teal-500",
  },
  {
    id: "rs4",
    user: "Beauty Needs",
    label: "Cosmetics",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=220&q=80",
    ring: "from-purple-400 to-pink-500",
  },
];

const B2B_STORIES: Story[] = [
  { id: "b1", user: "Khatunganj Trader", label: "New Import Container", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&q=80", live: true, ring: "from-blue-500 to-indigo-500" },
  { id: "b2", user: "Naryanganj Knit", label: "Garment Lots", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=220&q=80", ring: "from-cyan-400 to-blue-500" },
  { id: "b3", user: "Karwan Bazar", label: "Fresh Wholesale", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&q=80", ring: "from-emerald-400 to-teal-500" },
  { id: "b4", user: "Chowkbazar", label: "Cosmetic Stocks", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=220&q=80", ring: "from-purple-400 to-pink-500" },
];

const LOCAL_STORIES: Story[] = [
  { id: "l1", user: "Rahim Store", label: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&q=80", live: true, ring: "from-emerald-500 to-lime-400" },
  { id: "l2", user: "Dhaka Electronics", label: "Mobile Repair", image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=220&q=80", ring: "from-blue-400 to-indigo-500" },
  { id: "l3", user: "Sweet Corner", label: "Mishti Avaliable", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=220&q=80", ring: "from-amber-400 to-orange-500" },
  { id: "l4", user: "Bhai Bhai Fish", label: "Fresh Hilsha", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=220&q=80", ring: "from-cyan-400 to-blue-500" },
];

const SERVICES_STORIES: Story[] = [
  { id: "sr1", user: "Handyman Pro", label: "Plumbing Service", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=220&q=80", live: true, ring: "from-orange-500 to-amber-400" },
  { id: "sr2", user: "Cleanex", label: "Home Cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=220&q=80", ring: "from-teal-400 to-emerald-500" },
  { id: "sr3", user: "Electro Fix", label: "AC Servicing", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=220&q=80", ring: "from-blue-400 to-indigo-500" },
  { id: "sr4", user: "Beauty Spa", label: "Home Salon", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=220&q=80", ring: "from-pink-400 to-rose-500" },
];

const TRANSPORT_STORIES: Story[] = [
  { id: "ts1", user: "Pathao Express", label: "Fast Delivery ⚡", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&q=80", live: true, ring: "from-blue-500 to-indigo-500" },
  { id: "ts2", user: "Uber BD", label: "Safe Ride Share", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=220&q=80", ring: "from-cyan-400 to-blue-500" },
  { id: "ts3", user: "Truck Cargo", label: "Heavy Lifting", image: "https://images.unsplash.com/photo-1501700493717-9c988c494021?w=220&q=80", ring: "from-emerald-400 to-teal-500" },
];

const DIGITAL_STORIES: Story[] = [
  { id: "ds1", user: "Digital Pro", label: "Web Dev Tips", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=220&q=80", live: true, ring: "from-indigo-500 to-purple-500" },
  { id: "ds2", user: "Creative Mind", label: "UI Trends", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=220&q=80", ring: "from-pink-400 to-indigo-500" },
];

export function StoryBar({ context = 'feed' }: { context?: 'feed' | 'retail' | 'wholesale' | 'local' | 'services' | 'transport' | 'digital-services' | 'wallet' }) {
  const { isAuthenticated } = useAuth();
  
  const stories = context === 'retail' ? RETAIL_STORIES 
                : context === 'wholesale' ? B2B_STORIES
                : context === 'local' ? LOCAL_STORIES
                : context === 'services' ? SERVICES_STORIES
                : context === 'transport' ? TRANSPORT_STORIES
                : context === 'digital-services' ? DIGITAL_STORIES
                : context === 'wallet' ? []
                : STORIES;

  return (
    <div
      className="flex gap-2.5 overflow-x-auto no-scrollbar px-3 md:px-0 pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Mini Hero Spotlight */}
      <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer">
        <MiniSpotlight context={context === 'wallet' ? 'feed' : context} />
        <span className="text-[10px] text-[var(--pm-text-muted)] font-bold whitespace-nowrap">Special Offers</span>
      </div>

      {/* Add Story */}
      <Link to={isAuthenticated ? "/reels" : "/auth/register"}>
        <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="relative w-[84px] h-[140px] rounded-2xl overflow-hidden border border-dashed border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-blue-500/5">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.35)] group-hover:scale-110 transition-transform duration-200">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] text-white/50 font-medium text-center px-2 leading-tight">
                {isAuthenticated ? "Add Story" : "Join Free"}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">Your Story</span>
        </div>
      </Link>

      {/* Story cards */}
      {stories.map((s) => (
        <Link key={s.id} to="/reels">
          <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="relative w-[84px] h-[140px] rounded-2xl overflow-hidden ring-1 ring-white/10">
              <img
                src={s.image}
                alt={s.user}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Dark gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />

              {/* Gradient ring avatar — top-left */}
              <div className={`absolute top-2 left-2 p-[2px] rounded-full bg-gradient-to-br ${s.ring} shadow-sm`}>
                <div className="h-7 w-7 rounded-full bg-[var(--pm-bg)] flex items-center justify-center text-[10px] font-bold text-white">
                  {s.user[0]}
                </div>
              </div>

              {/* Live badge */}
              {s.live && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-500/90 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </div>
              )}

              {/* Hover play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Label bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5">
                <p className="text-[9px] font-semibold text-white leading-tight line-clamp-2 drop-shadow">
                  {s.label}
                </p>
              </div>
            </div>

            <span className="text-[10px] text-white/40 font-medium whitespace-nowrap max-w-[84px] truncate text-center">
              {s.user}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
