import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { generateKeys } from '@/utils/functions/generateKeys';
import { ProductService } from '@/services/ProductService';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Visual } from '@/components/Visual';
import NoResultsVisual from '@/visuals/NoResults.svg';
import styles from './search.module.scss';

export default function SearchPage() {
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
          {products?.length} results found matching "{query}"
        </div>
      </div>
      <div className={styles.search__grid}>
        {products && products.map(product => <ProductCard key={product.id} product={product} />)}
        {!products && generateKeys(20).map(i => <ProductCard key={i} />)}

        {products && !products.length && (
          <Visual
            visual={<NoResultsVisual />}
            title="No results found!"
            subtitle='Try searching for something less specific, like "cup".'
          />
        )}
      </div>
    </div>
  );
}
