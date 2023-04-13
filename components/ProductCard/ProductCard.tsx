import Image from 'next/image';
import React from 'react';
import config from '@/config.json';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { Product } from '@/pages/api/products';
import { AddShoppingCartOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
  onAddToCart?: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const title = getNestedKey(props.product, config.product.titleKey);
  const subtitle = getNestedKey(props.product, config.product.subtitleKey);

  return (
    <div className={styles.product}>
      <Image
        className={styles.product__image}
        src={props.product.images[0]}
        alt={title}
        width={240}
        height={240}
      />

      <div className={styles.product__info}>
        <div className={styles.info__title}>{title}</div>
        <div className={styles.info__subtitle}>{subtitle}</div>
      </div>

      <div className={styles.product__price}>
        {`$${props.product.price.amount}`}
        <Button startIcon={<AddShoppingCartOutlined />} size="small" onClick={props.onAddToCart}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};
