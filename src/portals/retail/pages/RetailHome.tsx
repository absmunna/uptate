import React from 'react';
import { ProductCard } from '@/components/product/ProductCard'; // Assuming path
import { useQuery } from '@tanstack/react-query'; // Assuming standard

export const RetailHome = () => {
  // Use existing endpoint
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'retail'],
    queryFn: () => fetch('/api/v1/products?type=retail').then(res => res.json())
  });

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black heading">Retail Store</h1>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
