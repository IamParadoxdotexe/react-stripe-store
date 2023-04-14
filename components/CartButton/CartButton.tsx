import React, { useEffect, useState } from 'react';
import { CartService } from '@/services/CartService';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@/icons/ShoppingCart.svg';

export const CartButton: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    CartService.cartCount.subscribe(setCartCount);
  });

  return (
    <IconButton color="secondary" onClick={() => cartCount && CartService.checkout()}>
      <Badge badgeContent={cartCount} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
