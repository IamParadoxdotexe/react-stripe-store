import Image from 'next/image';
import React from 'react';
import { Product } from '@/pages/api/stripe/products';
import appConfig from '@/utils/constants/appConfig';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { CartService } from '@/services/CartService';
import { Button } from '@mui/material';
import ShoppingCartAddIcon from '@/icons/ShoppingCartAdd.svg';
import { useQuantityToggle } from '../useQuantityToggle';
import styles from './ProductCard.module.scss';

type ProductCardVariant = 'vertical' | 'horizontal';
type ProductCardAction = 'add-to-cart' | 'quantity-toggle';

type ProductCardProps = {
  product: Product;
  variant?: ProductCardVariant;
  action?: ProductCardAction;
};

const IMAGE_SIZE: { [key in ProductCardVariant]: number } = {
  vertical: 240,
  horizontal: 90
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const variant: ProductCardVariant = props.variant ?? 'vertical';
  const action: ProductCardAction = props.action ?? 'add-to-cart';

  const title = getNestedKey(props.product, appConfig.product.titleKey);
  const subtitle = getNestedKey(props.product, appConfig.product.subtitleKey);

  const { QuantityToggle, quantity, setQuanity } = useQuantityToggle();

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
          {action === 'add-to-cart' && (
            <Button
              startIcon={<ShoppingCartAddIcon />}
              size="small"
              onClick={() => CartService.addToCart(props.product, 1)}
            >
              Add to cart
            </Button>
          )}
          {action === 'quantity-toggle' && <QuantityToggle />}
        </div>
      </div>
    </div>
  );
};
