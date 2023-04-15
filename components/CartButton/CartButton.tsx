import React, { useEffect, useState } from 'react';
import { CartService } from '@/services/CartService';
import { DrawerService } from '@/services/DrawerService';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@/icons/ShoppingCart.svg';

export const CartButton: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  const onOpen = () => {
    DrawerService.open(<div>Hello world!</div>);
  };

  useEffect(() => {
    CartService.cartCount.subscribe(setCartCount);
  });

  return (
    <IconButton color="secondary" onClick={onOpen}>
      <Badge badgeContent={cartCount} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
