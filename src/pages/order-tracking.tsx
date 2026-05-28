import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Clock, Package, Truck, CheckCircle2, 
  XCircle, Phone, MessageSquare, MapPin, Navigation, 
  ChevronRight, ChevronDown, ChevronUp, Share2, AlertCircle, 
  Play, Pause, RefreshCw, Star, ArrowLeft, ShieldAlert, Zap,
  Compass, ShieldCheck, Factory, Settings, HelpCircle
} from "lucide-react";
import { toast } from "sonner";

// Constant Status Configurations corresponding to the spec
type TrackingStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface TrackingStep {
  step: TrackingStatus;
  title: string;
  bnTitle: string;
  desc: string;
  bnDesc: string;
  location?: string;
  timestamp?: string;
  etaHours?: number;
}

const TRACKING_STEPS: TrackingStep[] = [
  { step: 1, title: "Order Placed", bnTitle: "অর্ডার সাবমিট করা হয়েছে", desc: "Order received by server queue", bnDesc: "অর্ডার সার্ভার কিউতে গ্রহণ করা হয়েছে", location: "Dhaka Central Queue", timestamp: "May 26, 10:14 AM" },
  { step: 2, title: "Payment Confirmed", bnTitle: "পেমেন্ট নিশ্চিত করা হয়েছে", desc: "Transaction authorized successfully", bnDesc: "পেমেন্ট ট্রানজেকশন সফলভাবে যাচাই করা হয়েছে", location: "bKash Settle Gateway", timestamp: "May 26, 10:20 AM" },
  { step: 3, title: "Seller Processing", bnTitle: "সেলার প্রসেস করছে", desc: "Wholesaler printing invoice & allocating inventory", bnDesc: "হোলসেলার চালান প্রিন্ট এবং ইনভেন্টরি বরাদ্দ করছে", location: "Tex-Gear Central Hub", timestamp: "May 26, 01:15 PM" },
  { step: 4, title: "Packed", bnTitle: "প্যাকিং সম্পন্ন", desc: "Lot cargo locked inside water-proof container straps", bnDesc: "কার্গো লট ওয়াটার-প্রুফ কন্টেইনার স্ট্র্যাপে প্যাক করা হয়েছে", location: "Mayer Doa Packing Center", timestamp: "May 26, 03:45 PM" },
  { step: 5, title: "Shipped", bnTitle: "শিপিং করা হয়েছে", desc: "Consignment handed to partner transporter", bnDesc: "কনসাইনমেন্ট পার্টনার ট্রান্সপোর্টারকে হস্তান্তর করা হয়েছে", location: "Tejgaon Freight Station", timestamp: "May 26, 06:10 PM" },
  { step: 6, title: "In Transit", bnTitle: "ইন ট্রানজিট", desc: "Moving on highway towards regional drop point", bnDesc: "আঞ্চলিক ড্রপ পয়েন্টে হাইওয়ে দিয়ে যাচ্ছে", location: "Dhaka-Mymensingh Truck Route", timestamp: "May 26, 08:30 PM" },
  { step: 7, title: "Out for Delivery", bnTitle: "ডেলিভারির জন্য বের হয়েছে", desc: "Assigned local three-wheeler van carrier dispatcher", bnDesc: "স্থানীয় থ্রি-হুইলার ভ্যান ক্যারিয়ারে বোঝাই করা হয়েছে", location: "Mirpur Hub Depot", timestamp: "Pending Dispatch" },
  { step: 8, title: "Delivered", bnTitle: "ডেলিভারি সম্পন্ন", desc: "Cargo seal validated and signature captured in secure ledger", bnDesc: "কার্গো সিল যাচাই এবং নথিপত্রে স্বাক্ষর গ্রহণ করা হয়েছে", location: "Consignee Shop Premise", timestamp: "Awaiting Arrival" }
];

// Tracking modes for Retail, Wholesale, Service, Factory Shipment, Logistics
type TrackingMode = "retail" | "wholesale" | "service" | "factory" | "logistics";

interface ModeDetail {
  id: TrackingMode;
  label: string;
  bnLabel: string;
  productName: string;
  bnProductName: string;
  sellerName: string;
  bnSellerName: string;
  variantInfo: string;
  bnVariantInfo: string;
  price: number;
  qtyLabel: string;
  bnQtyLabel: string;
  riderName: string;
  vehicle: string;
  vehicleNo: string;
}

const MODE_DETAILS: Record<TrackingMode, ModeDetail> = {
  wholesale: {
    id: "wholesale",
    label: "B2B Wholesale Lot",
    bnLabel: "বিটুবি পাইকারি লট",
    productName: "Bulk Cotton Polo Shirts (Lot #12-D)",
    bnProductName: "বাল্ক কটন পোলো শার্ট (লট #১২-ডি)",
    sellerName: "Tex-Gear Factories Ltd",
    bnSellerName: "টেক্স-গিয়ার ফ্যাক্টরিজ লিমিটেড",
    variantInfo: "Assorted Medium / Large / Extra-Large Mixed",
    bnVariantInfo: "মিডিয়াম / লার্জ / এক্সট্রা লার্জ অ্যাসোর্টেড মিক্স",
    price: 65000,
    qtyLabel: "1 Container Lot (500 Pcs)",
    bnQtyLabel: "১ কন্টেইনার লট (৫০০ পিস)",
    riderName: "Sufian Chowdhury (Cargo Pilot)",
    vehicle: "Covered 3-Ton Freight Van",
    vehicleNo: "DHAKA-METRO-HA-4211"
  },
  retail: {
    id: "retail",
    label: "B2C Retail Unit",
    bnLabel: "রিটেল কাস্টমার পার্সেল",
    productName: "Samsung Galaxy F15 5G Smart Device",
    bnProductName: "স্যামসাং গ্যালাক্সি এফ১৫ ফাইভজি ডিভাইস",
    sellerName: "Samsung Official BD",
    bnSellerName: "স্যামসাং অফিশিয়াল বাংলাদেশ",
    variantInfo: "6GB RAM | 128GB Shimmering Indigo",
    bnVariantInfo: "৬জিবি র‍্যাম | ১২৮জিবি শিমারিং ইন্ডিগো",
    price: 18500,
    qtyLabel: "1 Retail Box Unit",
    bnQtyLabel: "১ রিটেল বক্স ইউনিট",
    riderName: "Rana Miah (Express Rider)",
    vehicle: "Runner Turbo 150cc Bike",
    vehicleNo: "DHAKA-METRO-LA-7402"
  },
  service: {
    id: "service",
    label: "Service On-Site Booking",
    bnLabel: "অন-সাইট সার্ভিস বুকিং",
    productName: "Industrial AC Compressor Repair",
    bnProductName: "ইন্ডাস্ট্রিয়াল এসি কম্প্রেসর মেরামত",
    sellerName: "Dhaka Engineering Sol.",
    bnSellerName: "ঢাকা ইঞ্জিনিয়ারিং সলিউশনস",
    variantInfo: "5-Ton Carrier Unit Maintenance",
    bnVariantInfo: "৫-টন ক্যারিয়ার ইউনিট রক্ষণাবেক্ষণ",
    price: 12000,
    qtyLabel: "Service Call Session",
    bnQtyLabel: "সার্ভিস কল সেশন",
    riderName: "Engr. Mahmud Hasan (AC Specialist)",
    vehicle: "Engineering Tool Van",
    vehicleNo: "DHAKA-METRO-WA-1240"
  },
  factory: {
    id: "factory",
    label: "Cross-Border Factory Shipment",
    bnLabel: "ক্রস-বর্ডার স্পেশাল ফ্যাক্টরি শিপমেন্ট",
    productName: "Raw Indigo Denim Fabric Roll Set",
    bnProductName: "র ইন্ডিগো ডেনিম ফ্যাব্রিক রোল সেট",
    sellerName: "Guangzhou Textiles Hub",
    bnSellerName: "গুয়াংজু টেক্সটাইল হাব",
    variantInfo: "300 GSM Heavy-Grade Cotton Twill",
    bnVariantInfo: "৩০০ জিএসএম হেভি-গ্রেড কটন টুইল",
    price: 320000,
    qtyLabel: "10 Industrial Fabric Rolls",
    bnQtyLabel: "১০টি ইন্ডাস্ট্রিয়াল ফ্যাব্রিক রোল",
    riderName: "Capt. Yeasir Arafat (Vessel Coordinator)",
    vehicle: "Logistics Feeder Ship Route",
    vehicleNo: "IMO-VESSEL-9140284"
  },
  logistics: {
    id: "logistics",
    label: "Third-Party Carrier Booking",
    bnLabel: "থার্ড-পাার্টি ক্যারিয়ার কার্গো বুকিং",
    productName: "Flatbed Truck Transit: Ctg Port to Dhaka Hub",
    bnProductName: "ফ্ল্যাটবেড ট্রাক ট্রানজিট: চট্টগ্রাম পোর্ট টু ঢাকা",
    sellerName: "Paikar Logistics Express",
    bnSellerName: "পাইকার লজিস্টিকস এক্সপ্রেস",
    variantInfo: "Chassis Container Carrier System",
    bnVariantInfo: "চ্যাসিস কন্টেইনার ক্যারিয়ার সিস্টেম",
    price: 25000,
    qtyLabel: "Flatbed Single Trip Cargo",
    bnQtyLabel: "ফ্ল্যাটবেড সিঙ্গেল ট্রিপ কার্গো",
    riderName: "Siddikur Rahman (Heavy Cargo Driver)",
    vehicle: "Tata Prime 4018 Heavy Tractor",
    vehicleNo: "CHATTO-METRO-U-5524"
  }
};

type ExceptionState = "none" | "delayed" | "unassigned" | "pending_payment" | "failed";

export default function OrderTracking() {
  const [activeMode, setActiveMode] = useState<TrackingMode>("wholesale");
  const [activeStep, setActiveStep] = useState<TrackingStatus>(6);
  const [exception, setException] = useState<ExceptionState>("none");
  const [isSimulating, setIsSimulating] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Expanded State for Mobile Timeline Accordion
  const [mobileExpandedSteps, setMobileExpandedSteps] = useState<Record<number, boolean>>({
    6: true, // Auto open active by default
  });

  // Track map dimensions for interactive line updates
  const mapRef = useRef<HTMLDivElement>(null);
  const timelineTopRef = useRef<HTMLDivElement>(null);

  const modeData = MODE_DETAILS[activeMode];
  const activeStepObj = TRACKING_STEPS.find(s => s.step === activeStep) || TRACKING_STEPS[5];

  // Auto progression simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= 8) {
            setIsSimulating(false);
            toast.success(language === "bn" ? "অর্ডার সফলভাবে পৌঁছে গেছে!" : "Consignment delivered successfully!");
            return 8;
          }
          const nextStep = (prev + 1) as TrackingStatus;
          setMobileExpandedSteps(old => ({ ...old, [nextStep]: true }));
          toast.info(
            language === "bn" 
              ? `স্থিতি পরিবর্তন: ${TRACKING_STEPS[nextStep - 1].bnTitle}` 
              : `Status updated: ${TRACKING_STEPS[nextStep - 1].title}`
          );
          return nextStep;
        });
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, language]);

  // Adjust coordinates based on current active step
  const getMapRiderPosition = () => {
    // Return relative X, Y coordinates % for SVG mock map plotting
    const coords: Record<TrackingStatus, { x: number; y: number }> = {
      1: { x: 15, y: 75 }, // Depot Start
      2: { x: 23, y: 71 },
      3: { x: 35, y: 64 }, // Packaging Station
      4: { x: 48, y: 55 },
      5: { x: 57, y: 44 }, // Shipped Tejgaon
      6: { x: 68, y: 38 }, // Transit Highway
      7: { x: 80, y: 30 }, // Out for delivery local
      8: { x: 89, y: 24 }  // Customer Destination Shop
    };
    return coords[activeStep] || { x: 68, y: 38 };
  };

  const riderPos = getMapRiderPosition();

  // Handle support phone trigger
  const triggerCallPilot = () => {
    toast.success(
      language === "bn" 
        ? `কল করা হচ্ছে: ${modeData.riderName} (${modeData.vehicleNo})` 
        : `Calling Delivery Officer: ${modeData.riderName}`
    );
  };

  const triggerChatPilot = () => {
    toast.info(
      language === "bn"
        ? `${modeData.riderName}-এর সাথে চ্যাট রুম ক্রিয়েট করা হয়েছে!`
        : `Secure chat thread initiated with ${modeData.riderName}`
    );
  };

  const toggleAccordionStep = (stepNr: number) => {
    setMobileExpandedSteps(prev => ({
      ...prev,
      [stepNr]: !prev[stepNr]
    }));
  };

  return (
    <div className="min-h-screen text-[var(--pm-text)] bg-[var(--pm-bg)] font-sans overflow-x-hidden md:pb-12">
      
      {/* Simulation Controller Panel (Dev Tools Overlay - Top Absolute) */}
      <div className="w-full bg-[var(--pm-surface)] border-b border-white/5 py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-gray-400 font-bold uppercase tracking-wider font-mono">
            {language === "bn" ? "অর্ডার ট্র্যাকিং সিমুলেটর" : "Cargo Node Controller"}
          </span>
        </div>
        
        {/* State options buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Mode changer */}
          <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-lg">
            {(["wholesale", "retail", "service", "factory", "logistics"] as TrackingMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setActiveMode(m); }}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  activeMode === m ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Steps Direct selector */}
          <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-lg items-center gap-1.5 px-2">
            <span className="text-gray-500 font-mono text-[9px]">STEP:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => { 
                  setActiveStep(s as TrackingStatus);
                  setMobileExpandedSteps(old => ({ ...old, [s]: true }));
                }}
                className={`w-5 h-5 rounded text-[10px] font-black font-mono transition-all ${
                  activeStep === s ? "bg-cyan-400 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Exceptions controller */}
          <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-lg items-center gap-1">
            <span className="text-gray-500 font-mono text-[9px] px-1">ERR:</span>
            {(["none", "delayed", "unassigned", "pending_payment", "failed"] as ExceptionState[]).map((ex) => (
              <button
                key={ex}
                onClick={() => { setException(ex); }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  exception === ex ? "bg-rose-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {ex === "none" ? "None" : ex}
              </button>
            ))}
          </div>

          {/* Interactive Simulation Switch */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1 rounded-full font-bold uppercase flex items-center gap-1.5 transition-all text-[10px] ${
              isSimulating 
                ? "bg-amber-400 text-black animate-pulse" 
                : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
            }`}
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isSimulating 
              ? (language === "bn" ? "সিমুলেশন চলছে" : "ACTIVE ROUTE LIVE") 
              : (language === "bn" ? "অটো প্লে সিমুলেট" : "PLAY AUTO SIM")}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(l => l === "bn" ? "en" : "bn")}
            className="px-2.5 py-1 rounded bg-[#161a26] text-gray-300 font-black font-mono border border-white/5 hover:bg-white/5 text-[10px]"
          >
            {language === "bn" ? "ENGLISH" : "বাংলা"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        
        {/* Exception Alerts Stack (Custom alerts based on error simulation spec) */}
        <AnimatePresence>
          {exception !== "none" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              {exception === "delayed" && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">
                      {language === "bn" ? "যাতায়াতে সাময়িক বিলম্ব" : "Transit Delay Detected"}
                    </h4>
                    <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                      {language === "bn" 
                        ? `মায়ের দোয়া লজিস্টিকস টঙ্গী ফ্লাইওভার এলাকায় ভারী যানজটের সম্মুখীন হয়েছে। ক্যারিয়ার পাইলট বিকল্প রুটে ধীরগতিতে যাত্রা করছেন। আমাদের সাপোর্ট হটলাইন সক্রিয় রয়েছে।` 
                        : `Mayer Doa Logistics is experiencing heavy slow-downs near the Tongi highway bottleneck. Transporter has recalculated custom paths; security guarantees remain intact.`}
                    </p>
                    <button 
                      onClick={() => toast.success("Connected to Logistics Dispatch Desk helpline.")}
                      className="mt-2 text-xs font-bold text-amber-400 hover:underline underline-offset-4"
                    >
                      {language === "bn" ? "লজিস্টিকস হটলাইনে কল করুন" : "Contact Logistics Desk"}
                    </button>
                  </div>
                </div>
              )}

              {exception === "unassigned" && (
                <div className="bg-slate-500/10 border border-slate-500/20 text-slate-200 p-4 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">
                      {language === "bn" ? "পাইলট বরাদ্দ করা হচ্ছে" : "Awaiting Dispatcher Assignment"}
                    </h4>
                    <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                      {language === "bn" 
                        ? `ফ্যাক্টরি কার্টনগুলো লোডিং ডকে প্যাকিং করা সম্পন্ন হচ্ছে। পরবর্তী ১৫ মিনিটের মধ্যে ডেলিভারির জন্য বিশেষ ভারী ট্রান্সপোর্ট ভ্যান এবং ড্রাইভার নিশ্চিত করা হবে।` 
                        : `Consignment is packed and locked in the outbound terminal queue. A designated heavy cargo pilot container allocation will be triggered within 15 minutes.`}
                    </p>
                  </div>
                </div>
              )}

              {exception === "pending_payment" && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-xl flex items-start gap-3 animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-400">
                      {language === "bn" ? "পেমেন্ট পেন্ডিং - হাত মেলানো সিকিউরিটি" : "Payment Verification Required"}
                    </h4>
                    <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                      {language === "bn" 
                        ? `আপনার কর্পোরেট ট্রানজেকশনে ব্যাংক পেমেন্ট গেটওয়েতে একটি সিকিউরিটি হ্যান্ডশেক বাকি রয়েছে। সোর্সিং অর্ডারটি সঠিক সময়ে ডেলিভারির জন্য অনুগ্রহ করে পুনরায় পেমেন্ট যাচাই করুন।` 
                        : `A security handshake sequence failed to authorize during heavy load. Secure escrow accounts require payment settlement validation to dispatch vehicles.`}
                    </p>
                    <button 
                      onClick={() => { setException("none"); toast.success("Payment authorized successfully! Clearing dispatch block."); }}
                      className="mt-2.5 h-8 px-4 bg-rose-500 hover:bg-rose-600 rounded-lg text-black text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center"
                    >
                      {language === "bn" ? "ভেরিফাই ও রি-ট্রাই করুন" : "Verify & Retry Settlement"}
                    </button>
                  </div>
                </div>
              )}

              {exception === "failed" && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-red-400">
                      {language === "bn" ? "ডেলিভারি ব্যর্থ হয়েছে - মিরপুর সেন্ট্রাল ডিপোতে ফেরত" : "Delivery Attempt Failed"}
                    </h4>
                    <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                      {language === "bn" 
                        ? `গ্রহীতার মোবাইল নম্বর কয়েকবার চেষ্টা করেও বন্ধ পাওয়া গেছে। কারগো লটটি সুরক্ষার তাগিদে মিরপুর সেন্ট্রাল ডিপোতে ফিরিয়ে নেয়া হয়েছে। পুনরায় ডেলিভারির শিডিউল করতে এখানে আলতো চাপুন।` 
                        : `Consignee reference contact was unreachable after multiple attempts during clearance validation. Consignment returned to Mirpur Depot. Press to reschedule.`}
                    </p>
                    <button 
                      onClick={() => { setException("none"); toast.success("Logistics parcel rescheduled for dispatch loop."); }}
                      className="mt-2 text-xs font-bold text-rose-400 hover:underline underline-offset-4"
                    >
                      {language === "bn" ? "রিসিডিউল লজিস্টিকস ডেলিভারি" : "Reschedule Immediate Transit Slot"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. ORDER SUMMARY HEADER CARD (Height: 120px, Padding: 24px, Radius: 20px) */}
        <div className="bg-[var(--pm-surface)] border border-white/5 rounded-[20px] p-6 mb-8 relative overflow-hidden backdrop-blur-md">
          {/* Subtle background overlay elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl" />

          {/* Core Grid structure */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative z-10 text-white">
            
            {/* Column 1: Order Meta Identification */}
            <div className="md:col-span-1 border-r border-white/5 pr-4 flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Secure Consignment</span>
              <h2 className="text-[16px] font-mono text-cyan-400 font-extrabold tracking-wider mt-1">
                PK-2026-BD55
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === "bn" ? "অর্ডার আইডি রেফারেন্স" : "Order ID"}
              </p>
            </div>

            {/* Column 2: Order Type and Portal Labels */}
            <div className="border-r border-white/5 px-0 md:px-4 flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Portal Classification</span>
              <span className="text-[14px] font-black tracking-tight text-white inline-flex items-center gap-1.5 mt-1 capitalize">
                {activeMode === "wholesale" && <Factory className="w-4 h-4 text-cyan-400" />}
                {activeMode === "retail" && <ShoppingBag className="w-4 h-4 text-rose-400" />}
                {activeMode === "service" && <Settings className="w-4 h-4 text-amber-500" />}
                {activeMode === "factory" && <Compass className="w-4 h-4 text-emerald-400" />}
                {activeMode === "logistics" && <Truck className="w-4 h-4 text-blue-400" />}
                {language === "bn" ? modeData.bnLabel : modeData.label}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === "bn" ? "অর্ডারের ধরন" : "Outbound Class"}
              </p>
            </div>

            {/* Column 3: Live Status Badge (Height 32px equivalent) */}
            <div className="border-r border-white/5 px-0 md:px-4 flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Outbound Status</span>
              
              <div className="flex items-center mt-1">
                <span className={`h-8 px-4 rounded-full flex items-center justify-center text-xs font-extrabold uppercase tracking-widest ${
                  activeStep === 8 
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                    : activeStep >= 5 
                    ? "bg-cyan-400/15 ring-2 ring-cyan-400/35 text-cyan-400" 
                    : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeStep === 8 ? "bg-emerald-400 animate-none" : "bg-cyan-400 animate-ping"}`} />
                  {language === "bn" ? activeStepObj.bnTitle : activeStepObj.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === "bn" ? "কার্গো বর্তমান অবস্থা" : "Current Logistics Status"}
              </p>
            </div>

            {/* Column 4: ETA Count Down timer */}
            <div className="px-0 md:px-4 flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">ETA Estimated</span>
              <h3 className="text-lg font-black text-amber-400 tracking-tight leading-none mt-1 font-mono">
                {activeStep === 8 
                  ? (language === "bn" ? "ডেলিভারড ✓" : "Arrived ✓") 
                  : `48:32 ${language === "bn" ? "ঘন্টা বাকি" : "Hrs Remaining"}`}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === "bn" ? "১ জুন ২০২৬ এর মধ্যে" : "Expected by June 1, 2026"}
              </p>
            </div>

          </div>
        </div>

        {/* ━━━━ TWO COLUMNS DESKTOP LAYOUT ━━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: LIVE TRACKING TIMELINE (8 columns) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-extrabold">
                {language === "bn" ? "রিয়েল-টাইম ট্র্যাকিং টাইমলাইন" : "Secure Cargo Nodes Ledger"}
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  {language === "bn" ? "স্বয়ংক্রিয় লাইভ সিঙ্ক অ্যাক্টিভ" : "Automated Sync Active"}
                </span>
              </div>
            </div>

            {/* Desktop Timeline Layout (Visible on desktop/tablet, collapses differently on mobile) */}
            <div className="hidden md:flex flex-col relative pl-8 pb-3" ref={timelineTopRef}>
              
              {/* Vertical Guide Line Track (width: 2px) */}
              <div className="absolute left-3.5 top-2.5 bottom-2.5 w-0.5 bg-white/5 pointer-events-none rounded-full" />
              <div 
                className="absolute left-3.5 top-2.5 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-400 pointer-events-none rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                style={{
                  height: `${((activeStep - 1) / 7) * 100}%`
                }}
              />

              {/* Step Cards Array */}
              <div className="flex flex-col gap-5">
                {TRACKING_STEPS.map((stepItem) => {
                  const isCompleted = stepItem.step < activeStep;
                  const isActive = stepItem.step === activeStep;
                  const isPending = stepItem.step > activeStep;

                  return (
                    <motion.div
                      key={stepItem.step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: stepItem.step * 0.05 }}
                      className={`relative flex items-start gap-4 p-5 rounded-[16px] border transition-all duration-300 ${
                        isActive 
                          ? "bg-cyan-500/5 border-cyan-400/40 shadow-lg shadow-cyan-400/5" 
                          : isCompleted 
                          ? "bg-emerald-500/[0.01] border-emerald-500/10" 
                          : "bg-white/[0.01] border-white/5 opacity-55"
                      }`}
                    >
                      {/* Interactive Step node bullet bulb absolute positioned on track line */}
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-1.5 z-10 flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isActive ? (
                          <div className="w-9 h-9 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse">
                            <Zap className="w-4.5 h-4.5 text-cyan-400 fill-cyan-400/20" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center text-slate-600">
                            <span className="text-[10px] font-bold font-mono">{stepItem.step}</span>
                          </div>
                        )}
                      </div>

                      {/* Content block inside card */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h4 className={`text-sm md:text-base font-bold tracking-tight ${isActive ? "text-cyan-400 font-extrabold" : "text-white"}`}>
                            {language === "bn" ? stepItem.bnTitle : stepItem.title}
                          </h4>
                          {stepItem.timestamp && (
                            <span className={`text-xs font-mono font-bold ${isActive ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md" : "text-slate-500"}`}>
                              {stepItem.step === 7 && activeStep < 7 
                                ? (language === "bn" ? "অপেক্ষারত" : "Pending Arrival")
                                : stepItem.step === 8 && activeStep < 8
                                ? (language === "bn" ? "অপেক্ষারত" : "Pending Delivery")
                                : stepItem.timestamp
                              }
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-400 leading-normal">
                          {language === "bn" ? stepItem.bnDesc : stepItem.desc}
                        </p>

                        {/* Location Sub-Indicator if available */}
                        {stepItem.location && (
                          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 bg-black/30 w-fit px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-cyan-500/70" />
                            <span>
                              {stepItem.step === 7 && activeStep < 7
                                ? (language === "bn" ? "ডিপো বরাদ্দ হবে" : "Pending Depot Slot")
                                : stepItem.step === 8 && activeStep < 8
                                ? (language === "bn" ? "গ্রহীতার শপ" : "Consignee Address")
                                : stepItem.location
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Accordion Style Timeline (Visible strictly on mobile <768px) */}
            <div className="flex md:hidden flex-col gap-3">
              {TRACKING_STEPS.map((stepItem) => {
                const isCompleted = stepItem.step < activeStep;
                const isActive = stepItem.step === activeStep;
                const isPending = stepItem.step > activeStep;
                const isExpanded = !!mobileExpandedSteps[stepItem.step];

                return (
                  <div
                    key={stepItem.step}
                    className={`rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? "bg-cyan-500/5 border-cyan-400/40" 
                        : isCompleted 
                        ? "bg-emerald-500/[0.01] border-emerald-500/10" 
                        : "bg-white/[0.01] border-white/5 opacity-60"
                    }`}
                  >
                    {/* Collapsible Accordion Header Target Frame */}
                    <button
                      onClick={() => toggleAccordionStep(stepItem.step)}
                      className="w-full p-4 flex items-center justify-between text-left h-14"
                    >
                      <div className="flex items-center gap-3">
                        {/* Compact Bulb Node */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          ) : isActive ? (
                            <div className="w-7 h-7 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 animation-pulse">
                              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-slate-600 text-[9px] font-bold font-mono">
                              {stepItem.step}
                            </div>
                          )}
                        </div>

                        {/* Title Text */}
                        <span className={`text-xs md:text-sm font-bold tracking-tight ${isActive ? "text-cyan-400" : "text-white"}`}>
                          {language === "bn" ? stepItem.bnTitle : stepItem.title}
                        </span>
                      </div>

                      {/* Dropdown handle indicators */}
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="text-[9px] uppercase font-bold text-cyan-400 animate-pulse font-mono">
                            {language === "bn" ? "সক্রিয়" : "ACTIVE"}
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {/* Accordion content drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border-t border-white/5 bg-black/15"
                        >
                          <div className="p-4 flex flex-col gap-2.5 text-xs text-gray-300">
                            <p className="leading-relaxed">
                              {language === "bn" ? stepItem.bnDesc : stepItem.desc}
                            </p>

                            <div className="flex flex-col gap-1.5 font-mono text-[10px] text-gray-400 mt-1">
                              {stepItem.timestamp && (
                                <div className="flex justify-between">
                                  <span>{language === "bn" ? "সময়সূচি" : "Timestamp"}:</span>
                                  <span className="text-white">
                                    {stepItem.step === 7 && activeStep < 7 
                                      ? (language === "bn" ? "অপেক্ষারত" : "Pending")
                                      : labelTime(stepItem, activeStep, language)}
                                  </span>
                                </div>
                              )}
                              {stepItem.location && (
                                <div className="flex justify-between">
                                  <span>{language === "bn" ? "বর্তমান অবস্থান" : "Location"}:</span>
                                  <span className="text-cyan-400 font-bold">
                                    {stepItem.step === 7 && activeStep < 7
                                      ? (language === "bn" ? "বরাদ্দ বাকি" : "Awaiting")
                                      : stepItem.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY PANEL MAP + INFO (4 columns: width 360px on Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] w-full max-w-[360px] mx-auto flex flex-col gap-6">
            
            {/* A. LIVE MAP CONTAINER BLOCK (Height: 220px, Radius: 16px) */}
            <div 
              ref={mapRef}
              className="h-[220px] rounded-[16px] bg-[var(--pm-surface)] border border-white/10 relative overflow-hidden flex flex-col group shadow-lg shadow-black/40"
            >
              <div className="absolute top-2.5 left-2.5 z-10 px-2 py-1 bg-black/70 rounded-md border border-white/10 text-[9px] tracking-wider uppercase font-bold text-cyan-400 font-mono flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{language === "bn" ? "লাইভ জিপিএস ভেহিকল ট্র্যাকার" : "LIVE RADAR"}</span>
              </div>

              {/* Vector SVG Mock Bangladesh / Dhaka maps illustration */}
              <svg className="w-full h-full bg-[var(--pm-bg)]" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
                
                {/* Simulated geographic grids / river lanes */}
                <path d="M10,80 Q70,90 150,140 T290,190" fill="none" stroke="#16223f" strokeWidth="8" strokeOpacity="0.4" />
                <path d="M80,10 Q140,90 180,160 T250,210" fill="none" stroke="#16223f" strokeWidth="4" strokeOpacity="0.25" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#1e293b" strokeDasharray="5,5" strokeOpacity="0.3" />

                {/* Simulated arterial roads connecting Depot to Customer */}
                <path 
                  id="delivery-path"
                  d="M 50 160 Q 110 130 180 90 T 260 50" 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Colored route completed path */}
                <path 
                  d="M 50 160 Q 110 130 180 90 T 260 50" 
                  fill="none" 
                  stroke="#0891b2" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeDasharray="300"
                  strokeDashoffset={300 - (((activeStep - 1) / 7) * 300)}
                  className="transition-all duration-700"
                />

                {/* Map Pins / Logistics landmarks */}
                {/* 1. Start Dispatch Depot Terminal */}
                <circle cx="50" cy="160" r="5" fill="#10b981" />
                <circle cx="50" cy="160" r="9" fill="#10b981" fillOpacity="0.15" />
                
                {/* 2. Customer destination target shop pin */}
                <circle cx="260" cy="50" r="5" fill="#f43f5e" />
                <circle cx="260" cy="50" r="10" fill="#f43f5e" fillOpacity="0.15" className="animate-pulse" />

                {/* Interactive pulsing carrier location marker icon plotted via dynamic coords */}
                <g 
                  className="transition-all duration-700 ease-out"
                  transform={`translate(${50 + (210 * ((activeStep - 1) / 7))}, ${160 - (110 * ((activeStep - 1) / 7))})`}
                >
                  {/* Outer waves indicator ripple circle with pulse */}
                  <circle cx="0" cy="0" r="14" fill="#22d3ee" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '1.8s' }} />
                  <circle cx="0" cy="0" r="8" fill="#0284c7" />
                  <circle cx="0" cy="0" r="4.5" fill="#22d3ee" />
                </g>

                {/* Mini overlays labels */}
                <text x="50" y="176" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">DEPOT-MIRPUR</text>
                <text x="260" y="38" fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CONSIGNEE SHOP</text>
              </svg>

              {/* Bottom radar location indicators overlay */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-black/80 border-t border-white/5 flex items-center justify-between px-3.5 text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{activeStepObj.location || "Awaiting GPS Calibration"}</span>
                </span>
                <span className="text-cyan-400 font-bold shrink-0">
                  {Math.round(((activeStep - 1) / 7) * 100)}% {language === "bn" ? "সম্পন্ন" : "TRANSIT CLC"}
                </span>
              </div>
            </div>

            {/* B. PILOT DECK CARD (Avatar, rating, caller shortcuts) */}
            <div className="bg-[var(--pm-surface)] border border-white/5 rounded-[16px] p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                
                {/* Pilot profile Avatar (64x64px) */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" 
                    alt={modeData.riderName} 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--pm-surface)]" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                    {language === "bn" ? "দ্বায়িত্বপ্রাপ্ত ডেলিভারি পাইলট" : "Carrier Executive Coordinator"}
                  </span>
                  
                  <h4 className="text-sm font-black text-white tracking-tight truncate mt-0.5">
                    {modeData.riderName}
                  </h4>

                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 font-sans">
                    {modeData.vehicle} 
                    <span className="w-1 h-1 rounded-full bg-white/20" /> 
                    <span className="text-cyan-400 font-mono text-[9px] font-bold">{modeData.vehicleNo}</span>
                  </span>
                </div>

                {/* Stars aggregate feedback */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-mono text-xs font-black">4.9</span>
                  </div>
                  <span className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">142 deliveries</span>
                </div>

              </div>

              {/* Pilot Actions button set (Call Rider + Message Rider, height: Auto, Padding: 16) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={triggerCallPilot}
                  className="h-10 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {language === "bn" ? "কল করুন" : "Call Pilot"}
                </button>
                <button 
                  onClick={triggerChatPilot}
                  className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  {language === "bn" ? "মেসেজ" : "Message"}
                </button>
              </div>
            </div>

            {/* C. LOT SPECIFIC ITEM DETAILS CARD (80x80px Image) */}
            <div className="p-5 rounded-[20px] bg-[var(--pm-surface)] border border-white/5 flex flex-col gap-4">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">
                {language === "bn" ? "নিরাপদ চালান বিবরণী" : "Consignment Ledger Items"}
              </span>

              <div className="flex items-start gap-3">
                
                {/* Product/Lot Image (80x80px equivalent size) */}
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden shrink-0 border border-white/5">
                  <img 
                    src={
                      activeMode === "wholesale" 
                        ? "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=150&q=80" 
                        : activeMode === "retail"
                        ? "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&q=80"
                        : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&q=80"
                    } 
                    alt="Outbound Lot" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {language === "bn" ? modeData.bnProductName : modeData.productName}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-1 leading-none">
                    {language === "bn" ? modeData.bnSellerName : modeData.sellerName}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/5 text-[9px] text-cyan-400 font-medium tracking-tight">
                    {language === "bn" ? modeData.bnVariantInfo : modeData.variantInfo}
                  </span>
                </div>

              </div>

              {/* Invoice Breakdown totals */}
              <div className="flex flex-col gap-2.5 border-t border-white/5 pt-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>{language === "bn" ? "পরিমাণ / সোর্স" : "Sourcing Mass"}</span>
                  <span className="text-white font-semibold font-mono">
                    {language === "bn" ? modeData.bnQtyLabel : modeData.qtyLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{language === "bn" ? "পেমেন্ট মেথড" : "Settle Gateway"}</span>
                  <span className="text-white uppercase font-bold font-mono">
                    {activeMode === "wholesale" ? "Paikar Escrow" : "bKash Settle"}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-0.5">
                  <span className="text-white font-bold">{language === "bn" ? "মোট পরিশোধিত মূল্য" : "Ledger Grand Total"}</span>
                  <span className="text-base font-black text-cyan-400 font-mono tracking-tight leading-none">
                    {formatBDT(modeData.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Escrow assurance badges */}
            <div className="bg-cyan-950/20 border border-cyan-500/10 p-3.5 rounded-xl flex gap-2.5 text-[11px] text-cyan-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <p className="leading-snug">
                {language === "bn" 
                  ? "পাইকার এসক্রো সিস্টেম চালানের সিল অনুমোদন ও স্বনামধন্য পাইলট স্বাক্ষর পূর্ব পর্যন্ত পেমেন্ট হোল্ড করে রাখে।" 
                  : "Paikar Trade Escrow protects bulk funds until the physical carrier seal matches consignee specifications."}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE INTERACTIVE ACTION FOIL PANEL STICKY TOP BAR (320px – 767px Adaptability) */}
      <div className="md:hidden fixed bottom-18 inset-x-0 h-16 bg-[#070a13] border-t border-cyan-500/15 backdrop-blur-md px-4 flex items-center justify-between z-40">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-gray-500 uppercase tracking-wider leading-none">
            {language === "bn" ? "ডেলিভারি ট্র্যাকার" : "MOBILE RADAR"}
          </span>
          <span className="text-sm font-black text-cyan-400 font-mono mt-1">
            {language === "bn" ? "ধাপ" : "STEP"} 0{activeStep}/08
          </span>
        </div>

        <div className="flex gap-2 h-10">
          <button 
            onClick={triggerCallPilot}
            className="px-3 bg-cyan-400 hover:bg-cyan-500 text-black rounded-lg text-xs font-black uppercase flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            {language === "bn" ? "পাইলট কল" : "Call"}
          </button>
          <button 
            onClick={() => {
              // Toggle modal scroll state coordinates simulation
              const newStep = activeStep === 8 ? 1 : (activeStep + 1) as TrackingStatus;
              setActiveStep(newStep);
              toast.info(`Simulated jump: ${TRACKING_STEPS[newStep-1].title}`);
            }}
            className="px-3 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          </button>
          <button 
            onClick={() => {
              try {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Safe logistics order receipt tracking code copied!");
                } else { throw new Error(); }
              } catch {
                 const input = document.createElement('input');
                 input.value = window.location.href;
                 document.body.appendChild(input);
                 input.select();
                 document.execCommand('copy');
                 document.body.removeChild(input);
                 toast.success("Tracking link copied! (fallback)");
              }
            }}
            className="px-2.5 bg-white/5 border border-white/10 text-white rounded-lg flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

    </div>
  );
}

// Subordinate helper functions to clean inline JSX calculations
function labelTime(stepItem: TrackingStep, curStep: TrackingStatus, lang: "bn"|"en") {
  if (stepItem.step > curStep) {
    return lang === "bn" ? "অপেক্ষারত" : "Pending";
  }
  return stepItem.timestamp;
}
