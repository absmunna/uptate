import { useLocation } from "wouter";
import { useListProducts, getListProductsQueryKey, ListProductsType, ListProductsSort } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryChips } from "@/components/product/CategoryChips";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Marketplace() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const q = searchParams.get("q") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const type = (searchParams.get("type") as ListProductsType) || undefined;
  const sort = (searchParams.get("sort") as ListProductsSort) || undefined;
  const nearMe = searchParams.get("nearMe") === "true";

  const { data: products, isLoading } = useListProducts(
    { q, categoryId, type, sort, nearMe },
    { query: { queryKey: getListProductsQueryKey({ q, categoryId, type, sort, nearMe }) } }
  );

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setLocation(`/marketplace?${params.toString()}`);
  };

  const types = ["retail", "wholesale", "dropship", "grocery", "service", "hotel"];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <CategoryChips activeId={categoryId} />
        
        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 mr-auto">
            <Switch 
              id="near-me" 
              checked={nearMe}
              onCheckedChange={(checked) => updateParams("nearMe", checked ? "true" : null)}
            />
            <Label htmlFor="near-me" className="text-white">Near Me</Label>
          </div>

          <Select value={type || "all"} onValueChange={(v) => updateParams("type", v === "all" ? null : v)}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(t => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort || "newest"} onValueChange={(v) => updateParams("sort", v)}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="trending">Trending Now</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {q && (
        <h2 className="text-xl font-semibold text-white">Search results for "{q}"</h2>
      )}

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
