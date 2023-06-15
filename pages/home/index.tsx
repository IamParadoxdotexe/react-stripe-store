import { arrayOf } from '@/utils/functions/arrayOf';
import { generateKeys } from '@/utils/functions/generateKeys';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import { Carousel } from '@/components/Carousel';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import styles from './home.module.scss';

export default function HomePage() {
  const _products = useServiceState(ProductService.products);
  const products = arrayOf(_products);
  const loading = !_products;

  return (
    <div className={styles.home}>
      <Carousel title="Featured Cups" loading={loading}>
        {!loading && products.map(product => <ProductCard key={product.id} product={product} />)}
        {loading && generateKeys(20).map(i => <ProductCard key={i} />)}
      </Carousel>
    </div>
  );
}
