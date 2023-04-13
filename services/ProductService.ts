import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';

export const ProductService = new (class {
  public products = new BehaviorSubject<Product[]>([]);

  constructor() {
    fetch('/api/stripe/products')
      .then(res => res.json())
      .then(products => this.products.next(products));
  }

  public onProductUpdated(product: Product) {
    const productIndex = this.products.value.findIndex(p => p.id === product.id);
    if (productIndex > -1) {
      this.products.value[productIndex] = product;
      this.products.next([...this.products.value]);
    }
  }
})();
