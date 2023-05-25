import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { generateKeys } from '@/utils/functions/generateKeys';
import { ProductService } from '@/services/ProductService';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Product } from './api/stripe/products';
import styles from './search.module.scss';

export default function Search() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>();

  const query = router.query.query as string;

  useEffect(() => {
    if (query) {
      setProducts(ProductService.search(query));
    }
  }, [query]);

  return (
    <div className={styles.search}>
      <div className={styles.search__header}>
        <div className={styles.header__title}>Search Results</div>
        <div className={styles.header__subtitle}>
          {products?.length} products matching "{query}"
        </div>
      </div>
      <div className={styles.search__grid}>
        {products && products.map(product => <ProductCard key={product.id} product={product} />)}
        {!products && generateKeys(20).map(i => <ProductCard key={i} />)}
      </div>
    </div>
  );
}
