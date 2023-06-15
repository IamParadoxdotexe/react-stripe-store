import appConfig from '@/utils/constants/appConfig';
import { arrayOf } from '@/utils/functions/arrayOf';
import { renderContent } from '@/utils/functions/renderContent';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import styles from './home.module.scss';

export default function HomePage() {
  const _products = useServiceState(ProductService.products);
  const products = arrayOf(_products);
  const loading = !_products;

  return (
    <div className={styles.home}>
      {appConfig.content.home.map(content => renderContent(content, products, loading))}
    </div>
  );
}
