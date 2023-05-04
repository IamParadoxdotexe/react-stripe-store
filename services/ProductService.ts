import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';
import { dictOf } from '@/utils/functions/dictOf';
import { getUrl } from '@/utils/functions/getUrl';

export type Products = {
  [id: string]: Product;
};

export const ProductService = new (class {
  public products = new BehaviorSubject<Products>({});

  public load() {
    fetch(getUrl('/api/stripe/products'))
      .then(res => res.json())
      .then((products: Product[]) => {
        this.products.next(dictOf(products, 'id'));
      });
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
