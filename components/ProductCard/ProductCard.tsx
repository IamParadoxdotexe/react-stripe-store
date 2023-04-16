import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import appConfig from '@/utils/constants/appConfig';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { CartItem, CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import ShoppingCartAddIcon from '@/icons/ShoppingCartAdd.svg';
import { useQuantityToggle } from '../useQuantityToggle';
import styles from './ProductCard.module.scss';

type ProductCardVariant = 'vertical' | 'horizontal';

type ProductCardProps = {
  product: Product;
  variant?: ProductCardVariant;
};

const IMAGE_SIZE: { [key in ProductCardVariant]: number } = {
  vertical: 240,
  horizontal: 90
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const [cartItem, setCartItem] = useState<CartItem>();

  const variant: ProductCardVariant = props.variant ?? 'vertical';

  const title = getNestedKey(props.product, appConfig.product.titleKey);
  const subtitle = getNestedKey(props.product, appConfig.product.subtitleKey);

  const { QuantityToggle, quantity, setQuantity } = useQuantityToggle({
    max: getNestedKey(props.product, appConfig.product.stockKey)
  });

  const AddToCartButton = () => (
    <Button
      startIcon={<ShoppingCartAddIcon />}
      size="small"
      onClick={() => CartService.updateCart(props.product, 1)}
    >
      Add to cart
    </Button>
  );

  useEffect(() => {
    CartService.cartItems.subscribe(cartItems =>
      setCartItem(cartItems.find(cartItem => cartItem.id === props.product.id))
    );
  }, []);

  // update quantity from cartItem change
  useEffect(() => {
    if (cartItem && quantity != cartItem.quantity) {
      setQuantity(cartItem?.quantity ?? 0);
    }
  }, [cartItem]);

  // update cartItem from quantity change
  useEffect(() => {
    if (cartItem && cartItem.quantity != quantity) {
      CartService.updateCart(props.product, quantity);
    }
  }, [quantity]);

  return (
    <div className={`${styles.product} ${styles[variant]}`}>
      <Image
        className={styles.product__image}
        src={props.product.images[0]}
        alt={title}
        width={IMAGE_SIZE[variant]}
        height={IMAGE_SIZE[variant]}
      />

      <div className={styles.product__content} style={{ width: IMAGE_SIZE.vertical }}>
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
