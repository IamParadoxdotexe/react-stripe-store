import { Product } from '@/pages/api/stripe/products';
import { generateKeys } from '@/utils/functions/generateKeys';
import { Content, ContentProps, ContentType } from '@/utils/types/Content';
import { Carousel } from '@/components/Carousel';
import { Grid } from '@/components/Grid';
import { ProductCard } from '@/components/ProductCard';

const CONTENT_COMPONENTS: { [key in ContentType]: React.FC<ContentProps> } = {
  CAROUSEL: Carousel,
  GRID: Grid
};

export const renderContent = (content: Content, products: Product[], loading: boolean) => {
  const Component = CONTENT_COMPONENTS[content.type];

  return (
    <Component key={content.key} title={content.title} loading={loading}>
      {!loading &&
        products
          .filter(content.hasProduct)
          .map(product => <ProductCard key={product.id} product={product} />)}
      {loading && generateKeys(10).map(i => <ProductCard key={i} />)}
    </Component>
  );
};
