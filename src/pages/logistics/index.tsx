import { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Truck, MapPin, Calculator, Package, Filter, Clock,
  CheckCircle2, ArrowRight, Zap, ChevronDown, ChevronUp, RefreshCw,
  Navigation, BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/lib/format";
import { useAuth } from "@/features/auth/AuthContext";
import { Link } from "react-router-dom";

// Bangladesh major cities with approx coords for distance calc
const BD_CITIES: Record<string, { lat: number; lng: number; label: string }> = {
  dhaka:      { lat: 23.8103, lng: 90.4125, label: "ঢাকা" },
  chittagong: { lat: 22.3569, lng: 91.7832, label: "চট্টগ্রাম" },
  sylhet:     { lat: 24.8949, lng: 91.8687, label: "সিলেট" },
  rajshahi:   { lat: 24.3745, lng: 88.6042, label: "রাজশাহী" },
  khulna:     { lat: 22.8456, lng: 89.5403, label: "খুলনা" },
  barisal:    { lat: 22.7010, lng: 90.3535, label: "বরিশাল" },
  rangpur:    { lat: 25.7439, lng: 89.2752, label: "রংপুর" },
  mymensingh: { lat: 24.7471, lng: 90.4203, label: "ময়মনসিংহ" },
  comilla:    { lat: 23.4607, lng: 91.1809, label: "কুমিল্লা" },
  narayanganj:{ lat: 23.6238, lng: 90.4997, label: "নারায়ণগঞ্জ" },
  gazipur:    { lat: 23.9999, lng: 90.4203, label: "গাজীপুর" },
  bogura:     { lat: 24.8510, lng: 89.3697, label: "বগুড়া" },
};

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Logistics cost model (Bangladesh road freight)
// Base: ৳6/ton-km, min ৳80
function calcLogisticsCost(distKm: number, weightKg: number, vehicleType: string) {
  const ratePerTonKm = vehicleType === "truck" ? 6 : vehicleType === "pickup" ? 9 : vehicleType === "bike" ? 15 : 12;
  const weightTon = Math.max(weightKg / 1000, 0.05);
  const raw = ratePerTonKm * distKm * weightTon * 1000;
  const base = Math.max(raw, vehicleType === "bike" ? 60 : 150);
  const platformFee = base * 0.05;
  return {
    baseCost: Math.round(base),
    platformFee: Math.round(platformFee),
    totalCost: Math.round(base + platformFee),
    ratePerTonKm,
    estimatedHours: vehicleType === "bike" ? (distKm / 25) : vehicleType === "pickup" ? (distKm / 45) : (distKm / 50),
  };
}

// Demo pickup requests
const DEMO_PICKUPS = [
  {
    id: "p1", from: "ইসলামপুর, ঢাকা", fromKey: "dhaka",
    to: "বগুড়া সদর", toKey: "bogura",
    product: "পোশাক - ২০০ পিস", weight: 80, vehicle: "pickup",
    status: "available", postedBy: "রহমান ট্রেডার্স", commission: 650,
    postedAt: "২ ঘণ্টা আগে",
  },
  {
    id: "p2", from: "খাতুনগঞ্জ, চট্টগ্রাম", fromKey: "chittagong",
    to: "সিলেট সদর", toKey: "sylhet",
    product: "মুদিমাল - ৫০০ কেজি", weight: 500, vehicle: "truck",
    status: "available", postedBy: "আমিন ট্রেডিং", commission: 1800,
    postedAt: "৪ ঘণ্টা আগে",
  },
  {
    id: "p3", from: "গাজীপুর শিল্পাঞ্চল", fromKey: "gazipur",
    to: "খুলনা", toKey: "khulna",
    product: "ইলেকট্রনিক্স যন্ত্রাংশ", weight: 120, vehicle: "pickup",
    status: "in_progress", postedBy: "টেক সাপ্লাই BD", commission: 1200,
    postedAt: "৬ ঘণ্টা আগে",
  },
  {
    id: "p4", from: "নারায়ণগঞ্জ", fromKey: "narayanganj",
    to: "কুমিল্লা", toKey: "comilla",
    product: "সুতা ও কাপড় - ৩ গাট্টি", weight: 200, vehicle: "pickup",
    status: "available", postedBy: "মেঘনা টেক্সটাইল", commission: 800,
    postedAt: "১ ঘণ্টা আগে",
  },
  {
    id: "p5", from: "রাজশাহী", fromKey: "rajshahi",
    to: "ঢাকা", toKey: "dhaka",
    product: "আম ও লিচু - ৩০০ কেজি", weight: 300, vehicle: "truck",
    status: "available", postedBy: "রাজশাহী এগ্রো", commission: 2200,
    postedAt: "৩০ মিনিট আগে",
  },
];

const VEHICLE_ICONS: Record<string, string> = {
  truck: "🚛", pickup: "🚐", bike: "🏍️", van: "🚌",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available:   { label: "উপলব্ধ",     color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  in_progress: { label: "চলমান",      color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  completed:   { label: "সম্পন্ন",    color: "text-white/40 bg-white/5 border-white/10" },
};

export default function LogisticsPage() {
  const { isAuthenticated } = useAuth();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("50");
  const [vehicle, setVehicle] = useState("pickup");
  const [result, setResult] = useState<ReturnType<typeof calcLogisticsCost> & { dist: number } | null>(null);
  const [filterVehicle, setFilterVehicle] = useState("all");
  const [filterStatus, setFilterStatus] = useState("available");
  const [expanded, setExpanded] = useState<string | null>(null);

  const calculate = useCallback(() => {
    const from = BD_CITIES[pickup];
    const to = BD_CITIES[destination];
    if (!from || !to) return;
    const dist = haversine(from.lat, from.lng, to.lat, to.lng);
    const cost = calcLogisticsCost(dist, parseFloat(weight) || 50, vehicle);
    setResult({ ...cost, dist: Math.round(dist) });
  }, [pickup, destination, weight, vehicle]);

  const filtered = DEMO_PICKUPS.filter(p => {
    const matchV = filterVehicle === "all" || p.vehicle === filterVehicle;
    const matchS = filterStatus === "all" || p.status === filterStatus;
    return matchV && matchS;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 p-6 md:p-8 bg-gradient-to-br from-[#04091a] to-[#060c1c]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">PaikarMart Logistics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            ডাইনামিক লজিস্টিক বোর্ড
          </h1>
          <p className="text-sm text-white/50 max-w-xl">
            দূরত্ব ও ওজন ভিত্তিক অটো ক্যালকুলেশন · রাইডার পিকআপ ম্যাচিং · রিয়েল-টাইম ট্র্যাকিং
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Logistics Calculator ── */}
        <GlassCard className="p-5 border border-blue-500/15">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-4 w-4 text-blue-400" />
            <h2 className="font-semibold text-white">ডেলিভারি খরচ ক্যালকুলেটর</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">পিকআপ শহর</Label>
                <Select value={pickup} onValueChange={setPickup}>
                  <SelectTrigger><SelectValue placeholder="উৎস" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(BD_CITIES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">গন্তব্য শহর</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger><SelectValue placeholder="গন্তব্য" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(BD_CITIES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">মোট ওজন (কেজি)</Label>
                <Input value={weight} onChange={e => setWeight(e.target.value)} type="number" min="1" placeholder="কেজি" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">গাড়ির ধরন</Label>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">🏍️ মোটরবাইক (≤ ১৫ কেজি)</SelectItem>
                    <SelectItem value="pickup">🚐 পিকআপ (≤ ৫০০ কেজি)</SelectItem>
                    <SelectItem value="van">🚌 ভ্যান (≤ ১ টন)</SelectItem>
                    <SelectItem value="truck">🚛 ট্রাক (১ টনের বেশি)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={calculate}
              disabled={!pickup || !destination}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 border-0 shadow-[0_0_16px_rgba(59,130,246,0.3)] hover:from-blue-400 hover:to-cyan-500"
            >
              <Calculator className="h-4 w-4 mr-2" /> খরচ হিসেব করুন
            </Button>

            {result && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/8 p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  <Navigation className="h-3.5 w-3.5" /> ক্যালকুলেশন ফলাফল
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 p-3 text-center">
                    <div className="text-xl font-black text-blue-300">{result.dist} কিমি</div>
                    <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">আনুমানিক দূরত্ব</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3 text-center">
                    <div className="text-xl font-black text-cyan-300">
                      {Math.round(result.estimatedHours)}–{Math.round(result.estimatedHours * 1.3)} ঘণ্টা
                    </div>
                    <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">আনুমানিক সময়</div>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/55">বেস ডেলিভারি চার্জ</span>
                    <span className="text-white font-semibold">{formatBDT(result.baseCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/55">প্ল্যাটফর্ম ফি (৫%)</span>
                    <span className="text-white/70">{formatBDT(result.platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-white/[0.06] pt-2">
                    <span className="text-white">মোট খরচ</span>
                    <span className="text-blue-300 text-lg">{formatBDT(result.totalCost)}</span>
                  </div>
                </div>
                <div className="text-[10px] text-white/30 text-center">
                  রেট: ৳{result.ratePerTonKm}/টন-কিমি · Google Maps API দিয়ে রিয়েল ডিসট্যান্স আরও নির্ভুল হবে
                </div>
                {isAuthenticated && (
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 border-0 text-xs">
                    <Zap className="h-3.5 w-3.5 mr-1.5" /> এই রুটে ডেলিভারি বুক করুন
                  </Button>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* ── Rate Reference ── */}
        <div className="flex flex-col gap-4">
          <GlassCard className="p-5 border border-white/[0.07]">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-cyan-400" />
              <h2 className="font-semibold text-white text-sm">রোড ফ্রেইট রেট</h2>
              <span className="text-[10px] text-white/35 ml-auto">Bangladesh Standard</span>
            </div>
            <div className="space-y-2">
              {[
                { v: "🏍️ মোটরবাইক", rate: "৳১৫/টন-কিমি", min: "মিন ৳৬০", max: "≤ ১৫ কেজি", color: "border-orange-500/20 text-orange-300" },
                { v: "🚐 পিকআপ",     rate: "৳৯/টন-কিমি",  min: "মিন ৳১৫০", max: "≤ ৫০০ কেজি", color: "border-cyan-500/20 text-cyan-300" },
                { v: "🚌 ভ্যান",      rate: "৳১২/টন-কিমি", min: "মিন ৳২০০", max: "≤ ১ টন", color: "border-blue-500/20 text-blue-300" },
                { v: "🚛 ট্রাক",      rate: "৳৬/টন-কিমি",  min: "মিন ৳৩০০", max: "১ টনের বেশি", color: "border-purple-500/20 text-purple-300" },
              ].map(({ v, rate, min, max, color }) => (
                <div key={v} className={cn("flex items-center justify-between p-2.5 rounded-lg border bg-white/[0.02]", color.split(" ")[0])}>
                  <div>
                    <span className="text-xs text-white/70">{v}</span>
                    <span className="text-[10px] text-white/30 ml-2">{max}</span>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-xs font-semibold", color.split(" ")[1])}>{rate}</div>
                    <div className="text-[10px] text-white/30">{min}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 border border-emerald-500/15 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">রাইডার হিসেবে যোগ দিন</h3>
            </div>
            <p className="text-xs text-white/50 mb-3">আপনার নিজের গন্তব্য অনুযায়ী পিকআপ রিকোয়েস্ট নিন। অতিরিক্ত আয় করুন।</p>
            {isAuthenticated ? (
              <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-xs">
                রাইডার প্রোফাইল তৈরি করুন
              </Button>
            ) : (
              <Link to="/auth/register">
                <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-xs">
                  রেজিস্ট্রেশন করুন
                </Button>
              </Link>
            )}
          </GlassCard>
        </div>
      </div>

      {/* ── Pickup Request Board ── */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" /> পিকআপ রিকোয়েস্ট বোর্ড
          </h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "available", "in_progress"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={cn("px-3 py-1.5 rounded-lg text-xs border transition-all",
                  filterStatus === s ? "border-blue-500/40 text-blue-300 bg-blue-500/10" : "border-white/10 text-white/40 hover:border-white/25"
                )}>
                {s === "all" ? "সব" : s === "available" ? "উপলব্ধ" : "চলমান"}
              </button>
            ))}
            <button onClick={() => setFilterVehicle(filterVehicle === "all" ? "pickup" : "all")}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all",
                filterVehicle !== "all" ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-white/10 text-white/40 hover:border-white/25"
              )}>
              <RefreshCw className="h-3 w-3" /> ফিল্টার
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(p => {
            const dist = BD_CITIES[p.fromKey] && BD_CITIES[p.toKey]
              ? Math.round(haversine(BD_CITIES[p.fromKey].lat, BD_CITIES[p.fromKey].lng, BD_CITIES[p.toKey].lat, BD_CITIES[p.toKey].lng))
              : null;
            const isOpen = expanded === p.id;
            const st = STATUS_LABELS[p.status];
            return (
              <GlassCard key={p.id} className="border border-white/[0.07] hover:border-blue-500/20 transition-all overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left p-4"
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0 mt-0.5">{VEHICLE_ICONS[p.vehicle]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{p.from}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-white/25 shrink-0" />
                            <span className="truncate">{p.to}</span>
                          </div>
                          <div className="text-xs text-white/45 mt-1">{p.product} · {p.weight} কেজি</div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", st.color)}>{st.label}</span>
                          <span className="text-sm font-bold text-emerald-400">{formatBDT(p.commission)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/35">
                        {dist && <span className="flex items-center gap-1"><Navigation className="h-3 w-3" />{dist} কিমি</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.postedAt}</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-white/20" />{p.postedBy}</span>
                      </div>
                    </div>
                    <div className="shrink-0 self-center">
                      {isOpen ? <ChevronUp className="h-4 w-4 text-white/30" /> : <ChevronDown className="h-4 w-4 text-white/30" />}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-white/[0.05]">
                    <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {[
                        { l: "গন্তব্য দূরত্ব", v: dist ? `${dist} কিমি` : "—" },
                        { l: "মোট ওজন", v: `${p.weight} কে���ি` },
                        { l: "গাড়ির ধরন", v: `${VEHICLE_ICONS[p.vehicle]} ${p.vehicle}` },
                        { l: "কমিশন", v: formatBDT(p.commission) },
                      ].map(({ l, v }) => (
                        <div key={l} className="rounded-lg bg-white/[0.03] p-2 text-center">
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">{l}</div>
                          <div className="text-xs font-semibold text-white mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                    {p.status === "available" && (
                      <div className="flex gap-2">
                        {isAuthenticated ? (
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 border-0 text-xs">
                            <Zap className="h-3.5 w-3.5 mr-1.5" /> পিকআপ গ্রহণ করুন
                          </Button>
                        ) : (
                          <Link to="/auth/login" className="flex-1">
                            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 border-0 text-xs">
                              লগইন করে গ্রহণ করুন
                            </Button>
                          </Link>
                        )}
                        <Button size="sm" variant="ghost" className="text-white/50 text-xs border border-white/10">
                          বিস্তারিত
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
