import { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import styles from './index.module.scss';

export default function Home() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    fetch('/api/stripe/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className={styles.home}>
      {products && (
        <div className={styles.products}>
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
