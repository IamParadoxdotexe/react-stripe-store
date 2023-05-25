import React from 'react';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { Badge, Fab, IconButton } from '@mui/material';
import ShoppingCartIcon from '@/icons/ShoppingCart.svg';
import styles from './CartButton.module.scss';

type CartButtonProps = {
  type?: 'normal' | 'fab';
};

export const CartButton: React.FC<CartButtonProps> = (props: CartButtonProps) => {
  const cart = useServiceState(CartService.cart);

  const onOpen = () => {
    DrawerService.open(DrawerType.CART);
  };

  return props.type === 'normal' ? (
    <IconButton className={styles.normal} onClick={onOpen}>
      <Badge badgeContent={cart.count} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  ) : (
    <Badge className={styles.fab} badgeContent={cart.count} color="secondary">
      <Fab onClick={onOpen} color="primary">
        <ShoppingCartIcon />
      </Fab>
    </Badge>
  );
};

CartButton.defaultProps = {
  type: 'normal'
};
