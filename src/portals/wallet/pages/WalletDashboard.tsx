import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, History, ShieldCheck,
  Send, Plus, Repeat, X, Check, ChevronRight, Copy,
  TrendingUp, BadgeCheck, Eye, EyeOff, Sparkles, QrCode,
  CreditCard, Phone, Building2, AlertCircle
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Transaction = {
  id: string; type: "credit" | "debit"; amount: number;
  label: string; sublabel: string; time: string; status: "success" | "pending" | "failed";
};

type TopUpMethod = { id: string; label: string; icon: any; color: string; sublabel: string };

const TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "credit", amount: 2500, label: "Order Payment Received", sublabel: "Order #ORD-4521 · Rahim Electronics", time: "Today, 3:42 PM", status: "success" },
  { id: "t2", type: "debit", amount: 1200, label: "Hilsa Fish Purchase", sublabel: "Bhai Bhai Fish Market", time: "Today, 11:20 AM", status: "success" },
  { id: "t3", type: "credit", amount: 500, label: "Cashback Reward", sublabel: "Eid Special Bonus", time: "Yesterday", status: "success" },
  { id: "t4", type: "debit", amount: 300, label: "Ride Payment", sublabel: "PaikarRide · Gulshan → Dhanmondi", time: "Yesterday", status: "success" },
  { id: "t5", type: "debit", amount: 1800, label: "Grocery Order", sublabel: "Rahman Fresh Mart", time: "May 26, 2026", status: "success" },
  { id: "t6", type: "credit", amount: 5000, label: "Wallet Top Up", sublabel: "Bkash · +8801712345678", time: "May 25, 2026", status: "success" },
  { id: "t7", type: "debit", amount: 950, label: "Service Booking", sublabel: "Rakib Electric Works", time: "May 24, 2026", status: "success" },
  { id: "t8", type: "credit", amount: 3200, label: "Sale Revenue", sublabel: "Product #SKU-8821 × 4", time: "May 23, 2026", status: "success" },
];

const TOP_UP_METHODS: TopUpMethod[] = [
  { id: "bkash", label: "bKash", icon: Phone, color: "text-pink-400", sublabel: "Mobile Banking" },
  { id: "nagad", label: "Nagad", icon: Phone, color: "text-orange-400", sublabel: "Mobile Banking" },
  { id: "rocket", label: "Rocket", icon: Phone, color: "text-purple-400", sublabel: "DBBL Mobile" },
  { id: "card", label: "Card", icon: CreditCard, color: "text-cyan-400", sublabel: "Visa / MC / Amex" },
  { id: "bank", label: "Bank", icon: Building2, color: "text-blue-400", sublabel: "NPSB Transfer" },
];

type ModalType = 'topup' | 'send' | 'withdraw' | null;

const BALANCE = 12750;

export function WalletDashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [txFilter, setTxFilter] = useState<"all" | "credit" | "debit">("all");

  const filteredTx = TRANSACTIONS.filter(t => txFilter === "all" || t.type === txFilter);

  const handleAction = () => {
    if (!amount || isNaN(Number(amount))) { toast.error("Enter a valid amount"); return; }
    const actions: Record<NonNullable<ModalType>, () => void> = {
      topup: () => toast.success(`৳${amount} added via ${selectedMethod || "bKash"}!`),
      send: () => toast.success(`৳${amount} sent to ${recipient || "recipient"}!`),
      withdraw: () => toast.success(`৳${amount} withdrawal initiated!`),
    };
    if (activeModal) actions[activeModal]?.();
    setActiveModal(null);
    setAmount("");
    setRecipient("");
  };

  const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="wallet" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="wallet" />
      </div>

      <div className="px-4 mt-4">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-6 bg-gradient-to-br from-violet-900/30 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
          <div className="absolute top-4 right-4">
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              {balanceVisible ? <Eye className="w-3.5 h-3.5 text-zinc-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-violet-400" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PaikarPay Balance</p>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[13px] font-black text-zinc-400">৳</span>
              <span className={cn("text-4xl font-black text-white transition-all", !balanceVisible && "blur-md select-none")}>
                {BALANCE.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mb-5">Available balance · Updated just now</p>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-4">
              <p className="text-[10px] text-zinc-500 flex-1">PaikarPay ID: <span className="text-zinc-300 font-mono">PM-28-7740-2926</span></p>
              <button onClick={() => { navigator.clipboard?.writeText('PM-28-7740-2926'); toast.success("Copied!"); }} className="p-1">
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Top Up", icon: Plus, color: "bg-violet-500", onClick: () => setActiveModal('topup') },
                { label: "Send", icon: Send, color: "bg-blue-500", onClick: () => setActiveModal('send') },
                { label: "Withdraw", icon: ArrowUpRight, color: "bg-emerald-500", onClick: () => setActiveModal('withdraw') },
                { label: "QR Pay", icon: QrCode, color: "bg-amber-500", onClick: () => toast.info("Show QR to receive payment") },
              ].map(({ label, icon: Icon, color, onClick }) => (
                <button key={label} onClick={onClick} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wide">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Tiles */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Total Earned", value: "৳62,400", sub: "This month", color: "text-emerald-400", icon: TrendingUp },
            { label: "Total Spent", value: "৳41,250", sub: "This month", color: "text-red-400", icon: ArrowUpRight },
            { label: "Cashback", value: "৳1,280", sub: "Available", color: "text-amber-400", icon: Sparkles },
          ].map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
              <Icon className={cn("w-4 h-4 mx-auto mb-1.5", color)} />
              <p className={cn("text-[12px] font-black", color)}>{value}</p>
              <p className="text-[9px] text-zinc-600 mt-0.5">{label}</p>
              <p className="text-[8px] text-zinc-700">{sub}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-black text-white uppercase tracking-widest">Transactions</p>
            <div className="flex gap-1">
              {(["all", "credit", "debit"] as const).map(f => (
                <button key={f} onClick={() => setTxFilter(f)} className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black transition-all", txFilter === f ? "bg-violet-500/15 border border-violet-500/30 text-violet-400" : "text-zinc-600 hover:text-zinc-400")}>
                  {f === "all" ? "All" : f === "credit" ? "In" : "Out"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTx.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
              >
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", tx.type === "credit" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20")}>
                  {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{tx.label}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{tx.sublabel}</p>
                  <p className="text-[9px] text-zinc-700 mt-0.5">{tx.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("text-[13px] font-black", tx.type === "credit" ? "text-emerald-400" : "text-red-400")}>
                    {tx.type === "credit" ? "+" : "−"}৳{tx.amount.toLocaleString()}
                  </p>
                  <div className={cn("flex items-center gap-0.5 justify-end mt-0.5", tx.status === "success" ? "text-emerald-600" : tx.status === "pending" ? "text-amber-600" : "text-red-600")}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span className="text-[8px] capitalize">{tx.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setActiveModal(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-white">
                  {activeModal === 'topup' ? "Add Money" : activeModal === 'send' ? "Send Money" : "Withdraw"}
                </h3>
                <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>

              {activeModal === 'topup' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Select Method</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TOP_UP_METHODS.map(m => {
                        const Icon = m.icon;
                        return (
                          <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all", selectedMethod === m.id ? "bg-violet-500/10 border-violet-500/30" : "bg-white/[0.02] border-white/[0.06]")}>
                            <Icon className={cn("w-5 h-5", m.color)} />
                            <p className="text-[10px] font-black text-white">{m.label}</p>
                            <p className="text-[8px] text-zinc-500">{m.sublabel}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'send' && (
                <div className="mb-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Recipient PaikarPay ID / Phone</label>
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="PM-XX-XXXX or 01XXXXXXXXX" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-violet-500/40" />
                </div>
              )}

              <div className="mb-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Amount (৳)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[18px] font-black text-white outline-none focus:border-violet-500/40" />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {QUICK_AMOUNTS.map(qa => (
                    <button key={qa} onClick={() => setAmount(qa.toString())} className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all", amount === qa.toString() ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-white/[0.04] border-white/[0.06] text-zinc-500")}>৳{qa}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleAction} disabled={!amount} className="w-full py-3.5 rounded-2xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-black text-[12px] uppercase tracking-wide transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {activeModal === 'topup' ? "Add Money" : activeModal === 'send' ? "Send Money" : "Withdraw"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
