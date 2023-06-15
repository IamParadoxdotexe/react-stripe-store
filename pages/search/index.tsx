import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { generateKeys } from '@/utils/functions/generateKeys';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import { Grid } from '@/components/Grid';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Visual } from '@/components/Visual';
import NoResultsVisual from '@/visuals/NoResults.svg';
import styles from './search.module.scss';

export default function SearchPage() {
  const router = useRouter();

  const _products = useServiceState(ProductService.products);
  const [searchProducts, setSearchProducts] = useState<Product[]>();
  const loading = !searchProducts;

  const query = router.query.query as string;

  useEffect(() => {
    if (_products && query) {
      setSearchProducts(ProductService.search(query));
    }
  }, [_products, query]);

  return (
    <div className={styles.search}>
      <Grid
        title="Search Results"
        subtitle={`${searchProducts?.length ?? 0} results found matching "${query ?? ''}"`}
        loading={loading}
      >
        {searchProducts &&
          searchProducts.map(product => <ProductCard key={product.id} product={product} />)}
        {loading && generateKeys(8).map(i => <ProductCard key={i} />)}

        {searchProducts && !searchProducts.length && (
          <Visual
            visual={<NoResultsVisual />}
            title="No results found!"
            subtitle='Try searching for something less specific, like "cup".'
          />
        )}
      </Grid>
    </div>
  );
}
