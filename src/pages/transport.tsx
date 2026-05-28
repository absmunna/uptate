import * as React from "react";
import { useState } from "react";
import { 
  Car, Bike, MapPin, Search, Navigation, Info, 
  Truck, Package, Globe2, Sparkles, ChevronRight,
  Zap, Clock, ShieldCheck, Calculator, ArrowLeft 
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

export default function TransportPortal() {
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("cat") || "all";
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 pb-24 flex flex-col pt-16">
      <div className="flex-1 flex flex-col gap-6 pt-2">
        <section className="pt-2 md:pt-4">
          <StoryBar context="transport" />
        </section>

        <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 -mx-4 px-4">
          <PortalIconBar context="transport" />
        </div>

        <div className="flex flex-col gap-6 pt-2">
          {/* Main Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-br from-amber-700/20 via-orange-900/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground">Transport & Delivery</h1>
                <p className="text-xs text-muted-foreground">Moving people and goods, verified & safe</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Pick up from</p>
                  <p className="text-sm font-semibold text-white">Your current location</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <Search className="h-5 w-5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Destination</p>
                  <p className="text-sm font-semibold text-white/40 italic">Where are you going or sending?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions for Passengers */}
          {(selectedCat === "all" || selectedCat === "bike" || selectedCat === "car") && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-foreground flex items-center gap-2 px-1">
                <Navigation className="w-4 h-4 text-emerald-500" />
                Book a Ride
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95">
                  <Car className="w-6 h-6" />
                  <span className="text-sm">Book Car</span>
                </button>
                <button className="bg-white text-black font-black py-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95">
                  <Bike className="w-6 h-6" />
                  <span className="text-sm">Book Bike</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions for Logistics/Packages */}
          {(selectedCat === "all" || selectedCat === "parcel" || selectedCat === "truck") && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-foreground flex items-center gap-2 px-1">
                <Package className="w-4 h-4 text-cyan-500" />
                Send Packages
              </h3>
              <GlassCard className="p-4 border border-cyan-500/20 bg-cyan-500/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Instant Courier</p>
                    <p className="text-[10px] text-white/50">Send anything, anywhere in minutes</p>
                  </div>
                  <Link to="/logistics">
                    <Button size="sm" variant="outline" className="text-[10px] h-8 px-3 border-cyan-500/30">
                      Open Board
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col items-center gap-1">
                    <Package className="w-5 h-5 text-emerald-400" />
                    <p className="text-[9px] font-bold text-white uppercase mt-1">Light (≤15kg)</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col items-center gap-1">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <p className="text-[9px] font-bold text-white uppercase mt-1">Heavy (≤500kg)</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Security & Info */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-400">Verified Safety</p>
                <p className="text-[10px] text-emerald-100/60 leading-relaxed mt-1">
                  Drivers and riders are background checked and verified with valid legal documents.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-300">Flexible Options</p>
                <p className="text-[10px] text-blue-100/60 leading-relaxed mt-1">
                  From daily commutes to heavy freight movements, PaikarMart covers your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity / Recommendations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 px-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Recent Destinations
            </h3>
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Dhanmondi Lake</p>
                    <p className="text-[10px] text-muted-foreground">House 2, Road 32, Dhaka</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Gulshan 2 Circle</p>
                    <p className="text-[10px] text-muted-foreground">Kamal Ataturk Ave, Dhaka</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
