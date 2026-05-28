import React from 'react';
import { Card } from '../../../components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-[var(--pm-surface-hover)] shrink-0 mb-4">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" referrerPolicy="no-referrer" />
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-[var(--pm-accent)] font-bold">BDT {product.price}</p>
      <button className="w-full mt-4 bg-[var(--pm-accent)] text-white py-2 rounded-lg text-sm font-medium">Add to Cart</button>
    </Card>
  );
};
