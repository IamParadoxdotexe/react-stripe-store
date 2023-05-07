import { arrayOf } from '@/utils/functions/arrayOf';
import { generateKeys } from '@/utils/functions/generateKeys';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import { Carousel } from '@/components/Carousel';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Splash } from '@/components/Splash';
import styles from './home.module.scss';

export default function Home() {
  const products = useServiceState(ProductService.products);

  const arrayOfProducts = arrayOf(products);
  const arrayOfProductsLoading = !arrayOfProducts.length;

  return (
    <div className={styles.home}>
      <Splash />
      <Carousel title="Featured Cups" loading={arrayOfProductsLoading}>
        {!arrayOfProductsLoading &&
          arrayOf(products).map(product => <ProductCard key={product.id} product={product} />)}
        {arrayOfProductsLoading && generateKeys(20).map(i => <ProductCard key={i} />)}
      </Carousel>
    </div>
  );
}
