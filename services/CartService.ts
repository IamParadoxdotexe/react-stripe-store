import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';

export type CartItem = Product & { quantity: number };

export const CartService = new (class {
  public cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartCount = new BehaviorSubject(0);

  public updateCart(product: Product, quantity: number) {
    const newCartItem = {
      ...product,
      quantity
    };

    const cartItemIndex = this.cartItems.value.findIndex(
      cartItem => cartItem.id === newCartItem.id
    );

    if (cartItemIndex > -1) {
      if (quantity > 0) {
        // update existing item
        this.cartItems.value.splice(cartItemIndex, 1, newCartItem);
      } else {
        // remove existing item
        this.cartItems.value.splice(cartItemIndex, 1);
      }
    } else if (quantity > 0) {
      // add new item
      this.cartItems.value.push(newCartItem);
    }

    this.cartItems.next(this.cartItems.value);

    // update cart count
    this.cartCount.next(
      this.cartItems.value.reduce((sum, cartItem: CartItem) => sum + cartItem.quantity, 0)
    );
  }

  public checkout() {
    fetch('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.cartItems.value)
    })
      .then(res => res.json())
      .then(({ url }) => {
        window.location = url;
      });
  }
})();
