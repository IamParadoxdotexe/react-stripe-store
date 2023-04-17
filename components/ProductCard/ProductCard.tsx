import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import { Product } from '@/pages/api/stripe/products';
import appConfig from '@/utils/constants/appConfig';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import ShoppingCartAddIcon from '@/icons/ShoppingCartAdd.svg';
import { useQuantityToggle } from '../useQuantityToggle';
import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
  variant?: 'vertical' | 'horizontal';
};

const IMAGE_SIZE: { [key in 'vertical' | 'horizontal']: number } = {
  vertical: 240,
  horizontal: 90
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const cartItems = useServiceState(CartService.cartItems);

  const cartItem = useMemo(
    () => cartItems.find(cartItem => cartItem.id === props.product.id),
    [cartItems]
  );

  const variant = props.variant ?? 'vertical';

  const title = getNestedKey(props.product, appConfig.product.titleKey);
  const subtitle = getNestedKey(props.product, appConfig.product.subtitleKey);

  const { QuantityToggle, quantity, setQuantity } = useQuantityToggle({
    initialValue: cartItem?.quantity,
    max: getNestedKey(props.product, appConfig.product.stockKey)
  });

  const AddToCartButton = () => (
    <Button startIcon={<ShoppingCartAddIcon />} size="small" onClick={() => setQuantity(1)}>
      Add to cart
    </Button>
  );

  // update quantity from cartItem change
  useEffect(() => {
    const cartItemQuantity = cartItem?.quantity ?? 0;
    if (quantity != cartItemQuantity) {
      setQuantity(cartItemQuantity);
    }
  }, [cartItem]);

  // update cartItem from quantity change
  useEffect(() => {
    const cartItemQuantity = cartItem?.quantity ?? 0;
    if (cartItemQuantity != quantity) {
      CartService.updateCart(props.product, quantity);
    }
  }, [quantity]);

  return (
    <div className={`${styles.product} ${styles[variant]}`}>
      <Image
        className={styles.product__image}
        src={props.product.images[0]}
        alt={title}
        width={240}
        height={240}
      />

      <div className={styles.product__content}>
        <div className={styles.product__info}>
          <div className={styles.info__title}>{title}</div>
          <div className={styles.info__subtitle}>{subtitle}</div>
        </div>

        <div className={styles.product__price}>
          {`$${props.product.price.amount}`}
          {quantity === 0 ? <AddToCartButton /> : <QuantityToggle />}
        </div>
      </div>
    </div>
  );
};
