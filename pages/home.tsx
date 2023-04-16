import { arrayOf } from '@/utils/functions/arrayOf';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import { Carousel } from '@/components/Carousel';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Splash } from '@/components/Splash';
import styles from './home.module.scss';

export default function Home() {
  const products = useServiceState(ProductService.products);

  return (
    <div className={styles.home}>
      <Splash />
      <Carousel title="Featured Cups">
        {arrayOf(products).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Carousel>
    </div>
  );
}
