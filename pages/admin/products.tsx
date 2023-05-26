import { Product } from '@/pages/api/stripe/products';
import { ProductService } from '@/services/ProductService';
import { Button } from '@mui/material';

export default function Products() {
  const createProduct = () => {
    const product: Product = {
      id: '',
      name: 'Stanley Cup',
      description: 'Construction Yellow',
      price: {
        id: '',
        amount: 31.99
      },
      images: [],
      metadata: {}
    };

    ProductService.create(product);
  };

  return (
    <div>
      <Button color="primary" onClick={createProduct}>
        Create
      </Button>
      <Button color="primary" onClick={() => ProductService.export()}>
        Export
      </Button>
    </div>
  );
}
