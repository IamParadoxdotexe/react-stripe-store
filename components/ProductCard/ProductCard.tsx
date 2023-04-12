import Image from 'next/image';
import React from 'react';

import { Product } from '@/pages/api/products';

import { AddShoppingCartOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';

import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  return (
    <div className={styles.product}>
      <Image
        className={styles.product__image}
        src={props.product.images[0]}
        alt={props.product.name}
        width={240}
        height={240}
      />

      <div className={styles.product__info}>
        <div className={styles.info__title}>{props.product.name}</div>
        <div className={styles.info__subtitle}>{props.product.metadata.type}</div>
      </div>

      <div className={styles.product__price}>
        {`$${props.product.price.amount}`}
        <Button startIcon={<AddShoppingCartOutlined />} size="small">
          Add to cart
        </Button>
      </div>
    </div>
  );
};
