import React from 'react';
import { formatMoney } from '@/utils/functions/formatMoney';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const cartItems = useServiceState(CartService.cartItems);
  const cartCount = useServiceState(CartService.cartCount);
  const cartTotal = useServiceState(CartService.cartTotal);

  return (
    <div className={styles.drawer}>
      <div className={styles.drawer__header}>
        <div className={styles.header__title}>Your Cart</div>
        <div className={styles.header__subtitle}>
          Items in your bag are not reserved — check out now to make them yours.
        </div>
      </div>

      <div className={styles.drawer__items}>
        {cartItems.map(cartItem => (
          <ProductCard key={cartItem.id} product={cartItem} variant="horizontal" />
        ))}
      </div>

      <div className={styles.drawer__checkout}>
        <div className={styles.checkout__total}>
          <div>{cartCount} items</div>
          <div>{formatMoney(cartTotal)}</div>
        </div>
        <Button variant="contained" onClick={() => CartService.checkout()}>
          Checkout
        </Button>
      </div>
    </div>
  );
};
