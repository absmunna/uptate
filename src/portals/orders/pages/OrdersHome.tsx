import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const OrdersHome = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetch('/api/v1/orders').then(res => res.json())
  });

  return (
    <div className="pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-3 pt-3">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <h1 className="font-extrabold text-lg text-[var(--pm-text)]">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--pm-accent)]"/></div>
      ) : (
        <div className="px-3 space-y-3">
          {orders?.map((order: any) => (
            <div key={order.id} className="p-4 rounded-2xl border flex items-center gap-4"
                style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
                <Package className="w-8 h-8 text-[var(--pm-text-muted)]"/>
                <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--pm-text)]">Order #{order.id}</p>
                    <p className="text-xs text-[var(--pm-text-muted)]">{order.status}</p>
                </div>
                <p className="text-sm font-bold text-[var(--pm-accent)]">৳ {order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
