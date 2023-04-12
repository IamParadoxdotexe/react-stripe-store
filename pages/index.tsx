import { useEffect, useState } from 'react';

import { Product } from '@/pages/api/products';

import { ShoppingCartOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';

import { ProductCard } from '@/components/ProductCard/ProductCard';

import styles from './index.module.scss';

export default function Home() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <>
      {products && (
        <div className={styles.products}>
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <form className={styles.checkout} action="/api/checkout">
        <Button variant="contained" startIcon={<ShoppingCartOutlined />} type="submit">
          Checkout
        </Button>
      </form>
    </>
  );
}
