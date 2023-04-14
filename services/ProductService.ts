import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';

export const ProductService = new (class {
  public products = new BehaviorSubject<Product[]>([]);

  constructor() {
    fetch('http://localhost:3000/api/stripe/products')
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

  public onProductCreated(product: Product) {
    this.products.value.push(product);
    this.products.next([...this.products.value]);
  }

  public onProductDeleted(productId: string) {
    this.products.next([...this.products.value.filter(p => p.id === productId)]);
  }
})();
