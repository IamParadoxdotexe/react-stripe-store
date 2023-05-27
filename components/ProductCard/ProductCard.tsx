import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import { Product } from '@/pages/api/stripe/products';
import appConfig from '@/utils/constants/appConfig';
import { formatMoney } from '@/utils/functions/formatMoney';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import { Skeleton } from '@/components/Skeleton';
import ShoppingCartAddIcon from '@/icons/ShoppingCartAdd.svg';
import { useQuantityToggle } from '../useQuantityToggle';
import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product?: Product;
  variant?: 'vertical' | 'horizontal';
  readOnly?: boolean;
  onClick?: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const cart = useServiceState(CartService.cart);

  const cartItem = useMemo(
    () => cart.items.find(cartItem => cartItem.id === props.product?.id),
    [cart]
  );

  const variant = props.variant ?? 'vertical';

  const title = getNestedKey(props.product, appConfig.product.titleKey) ?? 'Product Title';
  const subtitle = getNestedKey(props.product, appConfig.product.subtitleKey) ?? 'Product Subtitle';
  const stock = getNestedKey(props.product, appConfig.product.stockKey) ?? undefined;

  const { QuantityToggle, quantity, setQuantity } = useQuantityToggle({
    initialValue: cartItem?.quantity,
    max: stock
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
    if (props.product) {
      const cartItemQuantity = cartItem?.quantity ?? 0;
      if (cartItemQuantity != quantity) {
        CartService.updateCart(props.product, quantity);
      }
    }
  }, [quantity]);

  const loading = !props.product;

  return (
    <div
      className={`${styles.product} ${styles[variant]} ${props.onClick ? styles.clickable : ''}`}
      onClick={props.onClick}
    >
      <Skeleton className={styles.product__image} loading={loading}>
        {props.product && (
          <Image src={props.product.images[0]} alt={title} width={240} height={240} />
        )}
      </Skeleton>

      <div className={styles.product__content}>
        <div className={styles.product__info}>
          <Skeleton className={styles.info__title} loading={loading}>
            {title}
          </Skeleton>
          <Skeleton className={styles.info__subtitle} loading={loading}>
            {subtitle}
          </Skeleton>
        </div>

        <div className={styles.product__price}>
          <Skeleton loading={loading}>
            {props.product ? formatMoney(props.product.price.amount) : '$00.00'}
          </Skeleton>
          {!loading &&
            !props.readOnly &&
            (cartItem?.quantity ? <QuantityToggle /> : <AddToCartButton />)}
        </div>
      </div>
    </div>
  );
};
