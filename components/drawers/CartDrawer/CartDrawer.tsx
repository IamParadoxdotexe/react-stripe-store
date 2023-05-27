import React, { useState } from 'react';
import { formatMoney } from '@/utils/functions/formatMoney';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { FetchResponse } from '@/utils/types/FetchResponse';
import { CartService } from '@/services/CartService';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import { Visual } from '@/components/Visual';
import EmptyCartVisual from '@/visuals/EmptyCart.svg';
import { BaseDrawer } from '../BaseDrawer';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const cart = useServiceState(CartService.cart);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<FetchResponse>();

  const onCheckout = () => {
    setCheckingOut(true);
    CartService.checkout().then(fetchResponse => {
      setCheckingOut(false);
      setCheckoutResult(fetchResponse);
    });
  };

  return (
    <BaseDrawer
      title="Your Cart"
      subtitle="Items in your bag are not reserved — check out now to make them yours."
    >
      {cart.count > 0 && (
        <div className={styles.drawer__items}>
          {cart.items.map(cartItem => (
            <ProductCard key={cartItem.id} product={cartItem} variant="horizontal" />
          ))}
        </div>
      )}

      {cart.count === 0 && (
        <Visual
          visual={<EmptyCartVisual />}
          title="Your cart is empty!"
          subtitle="Try searching for a product by name or viewing featured products on the home page."
        />
      )}

      {cart.count > 0 && (
        <div className={styles.drawer__checkout}>
          <div className={styles.checkout__total}>
            <div>{cart.count} items</div>
            <div>{formatMoney(cart.total)}</div>
          </div>

          <LoadingButton variant="contained" onClick={onCheckout} loading={checkingOut}>
            Checkout
          </LoadingButton>

          {checkoutResult && !checkoutResult.isOk() && (
            <Alert severity="error">{checkoutResult.detail}</Alert>
          )}
        </div>
      )}
    </BaseDrawer>
  );
};
