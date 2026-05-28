import React from "react";
import { Truck, Package, CheckCircle2, Clock, Loader2, XCircle, AlertCircle } from "lucide-react";

export interface StatusHistoryEntry {
  status: string;
  at: string;
  note?: string;
}

interface OrderTrackingProps {
  statusHistory: StatusHistoryEntry[];
}

const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "pending": return <Clock className="w-5 h-5 text-amber-500" />;
    case "processing": return <Loader2 className="w-5 h-5 text-blue-500" />;
    case "shipped": return <Truck className="w-5 h-5 text-indigo-500" />;
    case "delivered": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "cancelled": return <XCircle className="w-5 h-5 text-rose-500" />;
    default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusProgress = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "pending": return 25;
    case "processing": return 50;
    case "shipped": return 75;
    case "delivered": return 100;
    default: return 0;
  }
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ statusHistory }) => {
  const latestStatus = statusHistory[statusHistory.length - 1]?.status || 'pending';
  const progress = getStatusProgress(latestStatus);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">অর্ডারের অবস্থা (Order Tracking)</h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-[var(--pm-border)] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[var(--pm-accent)] h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative border-l-2 border-[var(--pm-border)] ml-2.5">
        {statusHistory.map((entry, index) => (
          <div key={index} className="mb-6 ml-6 relative">
            <div className="absolute -left-[37px] top-0 p-1 bg-[var(--pm-bg)] rounded-full border-2 border-[var(--pm-border)]">
              {getStatusIcon(entry.status)}
            </div>
            <div>
              <p className="font-medium text-[var(--pm-text)] capitalize">{entry.status}</p>
              <p className="text-xs text-[var(--pm-text-secondary)]">
                {new Date(entry.at).toLocaleString('bn-BD', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {entry.note && <p className="text-sm mt-1 text-[var(--pm-text-secondary)]">{entry.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
