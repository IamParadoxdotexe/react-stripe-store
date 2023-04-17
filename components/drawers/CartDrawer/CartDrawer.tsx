import React from 'react';
import { formatMoney } from '@/utils/functions/formatMoney';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const cart = useServiceState(CartService.cart);

  return (
    <div className={styles.drawer}>
      <div className={styles.drawer__header}>
        <div className={styles.header__title}>Your Cart</div>
        <div className={styles.header__subtitle}>
          Items in your bag are not reserved — check out now to make them yours.
        </div>
      </div>

      <div className={styles.drawer__items}>
        {cart.items.map(cartItem => (
          <ProductCard key={cartItem.id} product={cartItem} variant="horizontal" />
        ))}
      </div>

      <div className={styles.drawer__checkout}>
        <div className={styles.checkout__total}>
          <div>{cart.count} items</div>
          <div>{formatMoney(cart.total)}</div>
        </div>
        <Button variant="contained" onClick={() => CartService.checkout()}>
          Checkout
        </Button>
      </div>
    </div>
  );
};
