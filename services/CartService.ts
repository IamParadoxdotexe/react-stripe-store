import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';

export type Cart = {
  [priceId: string]: number;
};

export const CartService = new (class {
  private cart: Cart = {};
  public cartCount = new BehaviorSubject(0);

  public addToCart(product: Product, quantity: number) {
    // update cart quantity
    if (!this.cart[product.price.id]) {
      this.cart[product.price.id] = 0;
    }
    this.cart[product.price.id] += quantity;

    // update cart count
    this.cartCount.next(Object.values(this.cart).reduce((sum, n) => sum + n, 0));
  }

  public checkout() {
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.cart)
    })
      .then(res => res.json())
      .then(({ url }) => {
        window.location = url;
      });
  }
})();
