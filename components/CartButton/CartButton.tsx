import React from 'react';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@/icons/ShoppingCart.svg';

export const CartButton: React.FC = () => {
  const cartCount = useServiceState(CartService.cartCount);

  const onOpen = () => {
    DrawerService.open(DrawerType.CART);
  };

  return (
    <IconButton color="secondary" onClick={onOpen}>
      <Badge badgeContent={cartCount} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
