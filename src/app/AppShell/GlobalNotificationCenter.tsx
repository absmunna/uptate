import React, { useState } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'message';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const GlobalNotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [notifications] = useState<Notification[]>([
    { 
        id: '1', 
        type: 'success', 
        title: 'Order Fulfilled', 
        message: 'Your order #ORD-8821 has been successfully delivered.', 
        timestamp: new Date().toISOString(), 
        isRead: false 
    },
    { 
        id: '2', 
        type: 'info', 
        title: 'Policy Update', 
        message: 'B2B Sourcing guidelines have been updated for Dhaka region.', 
        timestamp: new Date(Date.now() - 3600000).toISOString(), 
        isRead: true 
    },
  ]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-6 z-[200] w-[360px] max-h-[600px] bg-[#0c0f17]/95 backdrop-blur-2xl border border-white/5 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Notifications</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:text-rose-500 transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest italic">
                        All clear. No signals.
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className={cn(
                            "p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent",
                            !n.isRead && "bg-cyan-400/5 border-cyan-400/10"
                        )}>
                            <div className="flex gap-4">
                                <div className={cn(
                                    "p-2 h-fit rounded-xl",
                                    n.type === 'success' ? "bg-emerald-500/10 text-emerald-400" :
                                    n.type === 'warning' ? "bg-amber-500/10 text-amber-400" :
                                    n.type === 'message' ? "bg-indigo-500/10 text-indigo-400" :
                                    "bg-cyan-400/10 text-cyan-400"
                                )}>
                                    <NotificationIcon type={n.type} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{n.title}</h4>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">{n.message}</p>
                                    <p className="text-[8px] text-zinc-700 font-black mt-2 uppercase">12 Minutes Ago</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-black/20 text-center">
                <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Clear All Contexts</button>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch(type) {
        case 'success': return <CheckCircle2 className="w-4 h-4" />;
        case 'warning': return <AlertTriangle className="w-4 h-4" />;
        case 'message': return <MessageSquare className="w-4 h-4" />;
        default: return <Info className="w-4 h-4" />;
    }
};
