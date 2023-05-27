import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/Skeleton';
import ImageIcon from '@/icons/Image.svg';
import styles from './ProductCardImage.module.scss';

type ProductCardImageProps = {
  src?: string;
  alt?: string;
  loading?: boolean;
  size?: number;
};

export const ProductCardImage: React.FC<ProductCardImageProps> = (props: ProductCardImageProps) => {
  const style = {
    width: props.size,
    minWidth: props.size,
    height: props.size
  };

  return (
    <Skeleton className={styles.image} loading={props.loading} style={style}>
      {props.src ? (
        <Image src={props.src} alt={props.alt ?? ''} width={240} height={240} />
      ) : (
        <ImageIcon />
      )}
    </Skeleton>
  );
};

ProductCardImage.defaultProps = {
  size: 240
};
