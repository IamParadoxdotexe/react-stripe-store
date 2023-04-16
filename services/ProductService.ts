import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';

export type Products = {
  [id: string]: Product;
};

export const ProductService = new (class {
  public products = new BehaviorSubject<Products>({});

  constructor() {
    fetch('http://localhost:3000/api/stripe/products')
      .then(res => res.json())
      .then(products => this.products.next(products));
  }

  public onProductUpdated(product: Product) {
    this.products.next({
      ...this.products.value,
      [product.id]: product
    });
  }

  public onProductDeleted(productId: string) {
    delete this.products.value[productId];
    this.products.next({ ...this.products.value });
  }
})();
