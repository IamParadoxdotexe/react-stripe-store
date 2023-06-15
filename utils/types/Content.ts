import { ReactNode } from 'react';
import { Product } from '@/pages/api/stripe/products';

export enum ContentType {
  GRID = 'GRID',
  CAROUSEL = 'CAROUSEL'
}

export type Content = {
  key: string;
  type: ContentType;
  title: string;
  hasProduct: (product: Product) => boolean;
};

export type ContentProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode | ReactNode[];
  loading?: boolean;
};
