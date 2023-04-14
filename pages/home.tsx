import { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { ProductService } from '@/services/ProductService';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import Splash from '@/components/Splash';
import styles from './home.module.scss';

export default function Home() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    ProductService.products.subscribe(setProducts);
  }, []);

  return (
    <div className={styles.home}>
      <Splash />
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
