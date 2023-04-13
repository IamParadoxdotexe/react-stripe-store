import { Product } from '@/pages/api/stripe/products';

export const onProductUpdated = (product: Product) => {
  console.log(product);
};
