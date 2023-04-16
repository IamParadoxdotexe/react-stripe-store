import React from 'react';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { ProductCard } from '@/components/ProductCard';

export const CartDrawer: React.FC = () => {
  const cartItems = useServiceState(CartService.cartItems);

  return (
    <div>
      {cartItems.map(cartItem => (
        <ProductCard key={cartItem.id} product={cartItem} variant="horizontal" />
      ))}
    </div>
  );
};
