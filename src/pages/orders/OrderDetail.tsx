import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, MapPin, CheckCircle2, Truck, 
  Phone, MessageSquare, X, Package, ShieldCheck, 
  Clock, AlertCircle, Sparkles, Lock, Scale, AlertTriangle
} from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrder, type Order } from "@/features/orders/order.api";
import { useNotificationStore } from "@/store/notificationStore";
import { useComplianceStore } from "../../store/complianceStore";
import { motion, AnimatePresence } from "framer-motion";

function buildTimeline(status: string, placedAt: string) {
  const placed = new Date(placedAt);
  const fmt = (d: Date) =>
    d.toLocaleString("en-BD", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const stages = ["pending", "processing", "shipped", "delivered"];
  const currentIdx = stages.indexOf(status.toLowerCase());
  
  const timelineSteps = [
    { label: "Sourcing Initiated", desc: "Transmission received", icon: Clock },
    { label: "Inventory Organized", desc: "Processing at hub", icon: Package },
    { label: "Consignment Dispatched", desc: "En route to destination", icon: Truck },
    { label: "Inventory Settled", desc: "Handed over to buyer", icon: CheckCircle2 },
  ];

  return timelineSteps.map((step, i) => ({
    ...step,
    done: i <= (currentIdx === -1 ? 0 : currentIdx),
    active: i === (currentIdx === -1 ? 0 : currentIdx),
    date: i <= (currentIdx === -1 ? 0 : currentIdx) ? fmt(new Date(placed.getTime() + i * 24 * 3600000)) : "Waiting..."
  }));
}

export default function OrderDetail() {
  const { id } = useParams();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const [trackOpen, setTrackOpen] = useState(false);
  const [complainOpen, setComplainOpen] = useState(false);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  // Compliance states
  const { submitRefund, submitComplaint, refunds, complaints } = useComplianceStore();
  const [compSubject, setCompSubject] = useState('');
  const [compType, setCompType] = useState<'refund' | 'complaint'>('refund');
  const [compDesc, setCompDesc] = useState('');

  // Find if this order already has a refund or complaint raised
  const existingRefund = refunds?.find(r => r.orderId === id);
  const existingComplaint = complaints?.find(c => c.orderId === id);

  useEffect(() => {
    if (!id) return;
    getOrder(id).then((o) => setOrder(o ?? null));
  }, [id]);

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] px-4 pt-4 flex flex-col gap-6">
        <div className="h-10 w-48 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-32 bg-white/5 rounded-3xl animate-pulse" />
        <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] px-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10">
           <AlertCircle className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Transmission Not Found</h1>
          <p className="text-sm text-white/30 font-bold uppercase tracking-widest mt-2 max-w-[240px] mx-auto">This order hash does not exist in our ledger.</p>
        </div>
        <Button onClick={() => navigate("/profile")} className="bg-white/5 text-white border-white/10">Back to Profile</Button>
      </div>
    );
  }

  const timeline = buildTimeline(order.status, order.createdAt);
  const shortId = order.id.length > 12 ? `TXN-${order.id.slice(0, 8).toUpperCase()}` : order.id;
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-40 px-5 pt-6 flex flex-col gap-8 select-none">
      {/* Header View */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-[var(--pm-bg)]/80 backdrop-blur-xl py-2 -mx-2 px-2">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-90 transition-all">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
             <h1 className="text-sm font-black text-white uppercase tracking-widest">Consignment</h1>
             <p className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-tighter">Live Transmission Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
           <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Secured</span>
        </div>
      </div>

      {/* Primary Hash Card */}
      <Card className="p-6 bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pm-accent)]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[var(--pm-accent)]/10 transition-colors" />
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1.5">Consignment Hash</p>
              <h2 className="font-black text-2xl text-white tracking-tight">{shortId}</h2>
           </div>
           <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest">
              {order.status}
           </span>
        </div>
        <div className="flex items-center gap-3 pt-6 border-t border-white/5 relative z-10">
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-400" />
           </div>
           <div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Transmission Date</p>
              <p className="text-xs font-bold text-white/70">
                {new Date(order.createdAt).toLocaleString("en-BD", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
           </div>
        </div>
      </Card>

      {/* Sourcing Timeline */}
      <Card className="p-8 bg-white/[0.02] border-white/5 rounded-[2.5rem]">
        <h3 className="font-black text-xs text-white/90 mb-8 uppercase tracking-widest flex items-center gap-2">
           <Truck className="h-4 w-4 text-[var(--pm-accent)]" /> Transmission Journey
        </h3>
        <div className="space-y-10 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-white/5 shadow-inner" />
          {timeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-6 relative z-10 items-start group">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step.done ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/5 border border-white/10"
                } ${step.active ? "animate-pulse ring-4 ring-emerald-500/20" : ""}`}>
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between">
                      <p className={`font-black text-xs uppercase tracking-tight ${step.done ? "text-white" : "text-white/20"}`}>
                        {step.label}
                      </p>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">{step.date}</span>
                   </div>
                   <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 group-hover:text-white/50 transition-colors">
                      {step.desc}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Consignment Items */}
      <Card className="p-6 bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <h3 className="font-black text-xs text-white/90 uppercase tracking-widest">Organized Lots ({items.length})</h3>
           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-black text-white/40 uppercase">Elite Source</span>
           </div>
        </div>
        <div className="space-y-4">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/5 relative shrink-0">
                 {it.image ? (
                   <img src={it.image} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 ) : (
                   <Package className="w-6 h-6 text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                 )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1 mb-1">{it.title}</p>
                <div className="flex items-center gap-2">
                   <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">{it.sellerName || "Verified Wholesaler"}</p>
                   <div className="w-1 h-1 bg-white/10 rounded-full" />
                   <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">QTY: {it.qty}</p>
                </div>
              </div>
              <p className="text-sm font-black text-white">{formatPrice(it.price * it.qty)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Shipping Terminal */}
      <Card className="p-6 bg-white/[0.01] border-white/5 rounded-[2.5rem] space-y-4 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
           <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
           </div>
           <h4 className="text-xs font-black text-white uppercase tracking-widest">Logistics Destination</h4>
        </div>
        <div className="space-y-3 relative z-10">
           <p className="text-[11px] font-black text-white uppercase leading-tight tracking-tight">
              {order.address?.name || "Premium Merchant Account"}
           </p>
           <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">
              {order.address?.line1 || "Sourcing Hub 42, Sector 07"}<br />
              {order.address?.city || "Dhaka Global Logistics Node"}<br />
              {order.address?.phone || "+880 1XXX XXXXXX"}
           </p>
        </div>
      </Card>

      {/* Bangladesh E-Commerce Protection Panel */}
      <Card className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Digital Commerce Escrow Held</h4>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1 leading-relaxed">
              E-CAB & National Consumer Rights Assurance Guidelines fully active.
            </p>
          </div>
        </div>

        {existingRefund || existingComplaint ? (
          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Active Protection Case Active</span>
            </div>
            {existingRefund && (
              <p className="text-[10px] text-white/60 font-medium leading-relaxed">
                • রিফান্ড আবেদন সাবমিট করা হয়েছে। SLA স্ট্যাটাস: <span className="text-[var(--pm-accent)] capitalize font-black">{existingRefund.currentStatus}</span>
              </p>
            )}
            {existingComplaint && (
              <p className="text-[10px] text-white/60 font-medium leading-relaxed">
                • অভিযোগ বিবরণী সংরক্ষিত। ধরণ: <span className="text-emerald-400 font-bold">{existingComplaint.status}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[9px] text-white/40 leading-relaxed font-semibold">
              পণ্য না পেলে, ত্রুটিপূর্ণ হলে বা সাইজ অমিল হলে ডেলিভারীর ৩ দিনের মধ্যে রিফান্ড আবেদন অথবা প্রাতিষ্ঠানিক অভিযোগ উত্থাপন করুন।
            </p>
            <button 
              onClick={() => setComplainOpen(true)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> অভিযোগ বা রিফান্ড দাখিল করুন (Lodge Dispute)
            </button>
          </div>
        )}
      </Card>

      {/* Final Settlement Calculation */}
      <Card className="p-8 bg-white/[0.02] border-white/5 rounded-[3rem] space-y-6">
        <h3 className="font-black text-xs text-white/90 uppercase tracking-widest">Financial Ledger</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-black text-white/30 uppercase tracking-widest">
            <span>Aggregated Subtotal</span>
            <span className="text-white/60">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[11px] font-black text-emerald-400 uppercase tracking-widest">
              <span>Platform Concessions</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[11px] font-black text-white/30 uppercase tracking-widest">
            <span>Sourcing Fee (Logistics)</span>
            <span className="text-white/60">{formatPrice(order.delivery)}</span>
          </div>
          <div className="h-[1px] w-full bg-white/5 my-4" />
          <div className="flex justify-between items-end">
             <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Final Settlement</p>
                <p className="text-3xl font-black text-white leading-none tracking-tighter">{formatPrice(order.total)}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">Status</p>
                <div className="flex items-center gap-2 justify-end">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{order.status}</span>
                </div>
             </div>
          </div>
        </div>
      </Card>

      {/* Fixed Strategic Bridge Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pt-1 pb-10 sm:pb-6 glass-morphism border-t border-white/5 z-50">
        <div className="max-w-[480px] mx-auto flex gap-3">
           <button 
             onClick={() => addNotification("Merchant support initiated...", "info")}
             className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[var(--pm-accent)] transition-colors active:scale-90"
           >
              <Phone className="w-5 h-5" />
           </button>
           <button 
             onClick={() => setTrackOpen(true)}
             className="flex-1 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/80 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
              <Truck className="w-5 h-5" /> Live Track Transmissions
           </button>
        </div>
      </div>

      <AnimatePresence>
        {trackOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
            onClick={() => setTrackOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-[#0a0a14] rounded-t-[3rem] sm:rounded-[3rem] border-t sm:border border-white/10 p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                   <h3 className="font-black text-lg text-white uppercase tracking-tight">Transmission Terminal</h3>
                   <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mt-1">Live Sourcing Telemetry</p>
                </div>
                <button
                  onClick={() => setTrackOpen(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90"
                >
                  <X className="h-5 h-5" />
                </button>
              </div>

              <div className="rounded-[2rem] overflow-hidden h-56 bg-black/40 border border-white/5 flex flex-col items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.5)_25%,rgba(6,182,212,0.5)_50%,transparent_50%,transparent_75%,rgba(6,182,212,0.5)_75%)] bg-[length:32px_32px] group-hover:bg-[length:16px_16px] transition-all duration-700" />
                <div className="relative text-center space-y-4">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-cyan-500/20 shadow-2xl">
                     <Truck className="h-8 w-8 text-cyan-400 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">Transmission En Route</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                       <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">PK Hub-Alpha → Destination Node</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button onClick={() => addNotification("Rider channel secured...", "info")} className="flex items-center justify-center h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.05] transition-all">
                  <Phone className="h-4 w-4 mr-2" /> Connect Rider
                </button>
                <button className="flex items-center justify-center h-14 rounded-2xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
                  <MessageSquare className="h-4 w-4 mr-2" /> Terminal Chat
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-8 opacity-20 select-none">
                 <Lock className="w-3 h-3" />
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Consensus Verified Ledger PK-911</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {complainOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
            onClick={() => setComplainOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-[#0a0a14] rounded-t-[3rem] sm:rounded-[3rem] border-t sm:border border-white/10 p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                   <h3 className="font-black text-lg text-white uppercase tracking-tight">Lodge Dispute / Complaint</h3>
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">বাংলাদেশ জাতীয় ই-কমার্স পলিসি প্রোটোকল</p>
                </div>
                <button
                  onClick={() => setComplainOpen(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!id) return;
                  if (compType === 'refund') {
                    await submitRefund({
                      orderId: id,
                      sellerId: order?.items?.[0]?.sellerId || 'mock_seller_id',
                      amount: order?.total || 100,
                      reason: compSubject,
                    });
                    addNotification("Refund claim submitted successfully. Under 7-day trade review SLA.", "success");
                  } else {
                    await submitComplaint({
                      orderId: id,
                      subject: compSubject,
                      description: compDesc,
                    });
                    addNotification("Consumer protection escalation logged successfully.", "success");
                  }
                  setComplainOpen(false);
                  setCompSubject('');
                  setCompDesc('');
                }}
                className="space-y-4 relative z-10"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/50">Dispute Escalation Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCompType('refund')}
                      className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                        compType === 'refund' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' 
                          : 'bg-white/5 text-white/40 border-white/5'
                      }`}
                    >
                      রিফান্ড অনুরোধ (Escrow Refund)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompType('complaint')}
                      className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                        compType === 'complaint' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' 
                          : 'bg-white/5 text-white/40 border-white/5'
                      }`}
                    >
                      ভোক্তা অভিযোগ (Complaint)
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/50">Subject / Reason (মূল কারণ)*</label>
                  <input
                    type="text"
                    required
                    placeholder={compType === 'refund' ? 'যেমন: পণ্য পাইনি / সাইজ মেলেনি / ছেঁড়া পণ্য' : 'যেমন: বিক্রেতার অসদাচরণ / বিলম্বিত ডেলিভারি'}
                    value={compSubject}
                    onChange={(e) => setCompSubject(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                {compType === 'complaint' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50">Elaborate Description (বিস্তারিত বিবরণ)*</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর বিধি মোতাবেক আপনার অভিযোগের বিবরণ লিখুন..."
                      value={compDesc}
                      onChange={(e) => setCompDesc(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] text-amber-400/80 leading-relaxed font-medium">
                  🔒 <strong>নিরাপদ এস্ক্রো নীতি:</strong> আপনার পেমেন্ট ব্যাংক এস্ক্রো হোল্ডে সংরক্ষিত আছে। অভিযোগ নিষ্পত্তি না হওয়া পর্যন্ত মার্চেন্ট পেমেন্ট পাবেন না।
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--pm-accent)] text-white text-[10px] tracking-widest font-black uppercase rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[var(--pm-accent)]/20"
                >
                  সাবমিট করুন
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
