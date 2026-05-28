import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";

export const PKShopHome = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'pkshop'],
    queryFn: () => fetch('/api/v1/products?isPKStore=true').then(res => res.json())
  });

  const filtered = products?.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-3 pt-3">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <h1 className="font-extrabold text-lg text-[var(--pm-text)]">PK Shop</h1>
      </div>

      {/* Hero */}
      <div className="px-3 mb-6">
        <div className="h-40 rounded-2xl bg-linear-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl">
          Premium Curated
        </div>
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
          <input type="text" placeholder="Search curated items..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--pm-accent)]"/></div>
      ) : (
        <div className="px-3 grid grid-cols-2 gap-3">
          {filtered?.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
