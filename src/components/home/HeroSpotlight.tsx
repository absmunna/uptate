import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Flame, ShoppingBag, PlayCircle, MapPin, Car, Package, Code, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  gradient: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const SLIDES: Slide[] = [
  {
    id: "spotlight-1",
    eyebrow: "Featured Drop",
    title: "Smartphone Mid-range Sale",
    subtitle: "Up to 22% off · Free PK Coin cashback on first order",
    cta: "Shop the drop",
    href: "/marketplace",
    image:
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-blue-600/70 via-indigo-600/40 to-transparent",
    Icon: Sparkles,
  },
  {
    id: "spotlight-2",
    eyebrow: "Trending Now",
    title: "Fresh Hilsa Direct from Chandpur",
    subtitle: "Verified local sellers · Same-day delivery in Dhaka",
    cta: "Explore Local",
    href: "/local",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-emerald-600/70 via-teal-600/40 to-transparent",
    Icon: MapPin,
  },
  {
    id: "spotlight-3",
    eyebrow: "Creator Spotlight",
    title: "Premium Video Tutorials Unlocked",
    subtitle: "Pay with PK Coin · Preview before you unlock",
    cta: "Watch Now",
    href: "/reels",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-purple-600/70 via-pink-600/40 to-transparent",
    Icon: PlayCircle,
  },
  {
    id: "spotlight-4",
    eyebrow: "Hot This Week",
    title: "Wholesale Markets Open in Chittagong",
    subtitle: "Bulk pricing · 350+ verified vendors live",
    cta: "Browse Vendors",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-amber-600/70 via-orange-600/40 to-transparent",
    Icon: Flame,
  },
  {
    id: "spotlight-5",
    eyebrow: "Demand Match",
    title: "Post What You Need — Sellers Bid for It",
    subtitle: "23k active demand posts · Avg response < 4 hours",
    cta: "Post a Demand",
    href: "/demand",
    image:
      "https://images.unsplash.com/photo-1556742212-5b321f3c261b?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-rose-600/70 via-fuchsia-600/40 to-transparent",
    Icon: ShoppingBag,
  },
];

const RETAIL_SLIDES: Slide[] = [
  {
    id: "retail-1",
    eyebrow: "Winter Collection",
    title: "50% Off on Men's Jackets",
    subtitle: "Stay warm with our premium winter wear.",
    cta: "Shop Now",
    href: "/b2c",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    gradient: "from-slate-700/80 via-slate-500/40 to-transparent",
    Icon: Sparkles,
  },
  {
    id: "retail-2",
    eyebrow: "Electronics",
    title: "Smartwatches under ৳2000",
    subtitle: "Limited time offer on top brands",
    cta: "View Offers",
    href: "/b2c",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    gradient: "from-cyan-600/80 via-blue-500/40 to-transparent",
    Icon: Flame,
  }
];

const B2B_SLIDES: Slide[] = [
  { id: "b2b-1", eyebrow: "Bulk Order", title: "Factory Direct Spices", subtitle: "MOQ: 50kg, 12% Off", cta: "View", href: "/b2b", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80", gradient: "from-blue-700/80 via-blue-500/40 to-transparent", Icon: Sparkles },
  { id: "b2b-2", eyebrow: "Import Lots", title: "Korean Cosmetics", subtitle: "Clearance Sale", cta: "View", href: "/b2b", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80", gradient: "from-indigo-700/80 via-indigo-500/40 to-transparent", Icon: Flame },
];

const LOCAL_SLIDES: Slide[] = [
  { id: "loc-1", eyebrow: "Nearby Fresh", title: "Organic Veggies", subtitle: "10 mins delivery", cta: "View", href: "/local", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80", gradient: "from-green-700/80 via-green-500/40 to-transparent", Icon: MapPin },
  { id: "loc-2", eyebrow: "Pharmacy", title: "Medicines & Health", subtitle: "Fast delivery", cta: "View", href: "/local", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80", gradient: "from-emerald-700/80 via-teal-500/40 to-transparent", Icon: Sparkles },
];

const SERVICES_SLIDES: Slide[] = [
  { id: "srv-1", eyebrow: "Home Service", title: "AC Servicing", subtitle: "Book skilled tech", cta: "View", href: "/services", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80", gradient: "from-orange-700/80 via-orange-500/40 to-transparent", Icon: Flame },
  { id: "srv-2", eyebrow: "Cleaning", title: "Deep Home Clean", subtitle: "Top rated maids", cta: "View", href: "/services", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80", gradient: "from-blue-700/80 via-blue-500/40 to-transparent", Icon: Sparkles },
];

const TRANSPORT_SLIDES: Slide[] = [
  { id: "tr-1", eyebrow: "Safe Travel", title: "Book a Car", subtitle: "AC & Non-AC cars available", cta: "View", href: "/transport", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80", gradient: "from-blue-700/80 via-blue-500/40 to-transparent", Icon: Car },
  { id: "tr-2", eyebrow: "Parcel", title: "Send a Package", subtitle: "Instant delivery", cta: "View", href: "/transport", image: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=500&q=80", gradient: "from-amber-700/80 via-amber-500/40 to-transparent", Icon: Package },
];

const DIGITAL_SLIDES: Slide[] = [
  { id: "ds-1", eyebrow: "Web Development", title: "Build Your Website", subtitle: "Top fullstack developers", cta: "Hire", href: "/digital-services", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80", gradient: "from-indigo-700/80 via-indigo-500/40 to-transparent", Icon: Code },
  { id: "ds-2", eyebrow: "Graphic Design", title: "Professional Logos", subtitle: "Brand identity design", cta: "Order", href: "/digital-services", image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&q=80", gradient: "from-purple-700/80 via-purple-500/40 to-transparent", Icon: Palette },
];

export function MiniSpotlight({ context = 'feed' }: { context?: 'feed' | 'retail' | 'wholesale' | 'local' | 'services' | 'transport' | 'digital-services' }) {
  const [active, setActive] = React.useState(0);
 
  const slides = context === 'retail' ? RETAIL_SLIDES 
               : context === 'wholesale' ? B2B_SLIDES
               : context === 'local' ? LOCAL_SLIDES
               : context === 'services' ? SERVICES_SLIDES
               : context === 'transport' ? TRANSPORT_SLIDES
               : context === 'digital-services' ? DIGITAL_SLIDES
               : SLIDES;
  
  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[active] || slides[0];

  if (!slide) return null;

  return (
    <Link to={slide.href} className="block shrink-0 relative w-[88px] h-[140px] rounded-2xl overflow-hidden ring-1 ring-white/10 group shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,165,0,0.2)] transition-all transform hover:-translate-y-1">
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.image}
          alt={s.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'} group-hover:scale-110 transition-transform duration-700`}
        />
      ))}
      <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-2.5">
         <span className="text-[9px] font-black uppercase text-amber-400 flex items-center gap-1 mb-1 leading-tight tracking-wider">
            <slide.Icon className="w-2.5 h-2.5 text-amber-400" /> {context === 'retail' ? 'SALE' : 'HOT'}
         </span>
         <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
            {slide.title}
         </span>
      </div>
    </Link>
  );
}

export function HeroSpotlight() {
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const pausedRef = React.useRef(false);

  const scrollTo = React.useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  const go = React.useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => {
        const next = (prev + dir + SLIDES.length) % SLIDES.length;
        scrollTo(next);
        return next;
      });
    },
    [scrollTo],
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      go(1);
    }, 5000);
    return () => clearInterval(id);
  }, [go]);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const idx = Math.round(el.scrollLeft / w);
        if (idx !== active && idx >= 0 && idx < SLIDES.length) setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {SLIDES.map((s, i) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.id}
              className="relative shrink-0 w-full snap-start h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden rounded-2xl"
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-8 md:p-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 self-start mb-3 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] uppercase tracking-widest font-black shadow-lg"
                >
                  <Icon className="w-4 h-4" /> {s.eyebrow}
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-md leading-[1.1] tracking-tight"
                >
                  {s.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-lg font-medium drop-shadow"
                >
                  {s.subtitle}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-6 flex items-center gap-3"
                >
                  <Link to={s.href}>
                    <Button className="bg-[#00a859] text-white hover:bg-[#00a859]/90 rounded-xl font-bold px-6 py-5 shadow-[0_4px_14px_rgb(0,168,89,0.4)] hover:shadow-[0_6px_20px_rgb(0,168,89,0.6)] transition-all">
                      {s.cta}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#00a859] text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 border border-white/20 hover:border-transparent group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#00a859] text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 border border-white/20 hover:border-transparent group"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setActive(i);
              scrollTo(i);
            }}
            className={`transition-all duration-300 rounded-full ${
              i === active
                ? "w-8 h-2 bg-[#00a859] shadow-[0_0_8px_rgba(0,168,89,0.8)]"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
