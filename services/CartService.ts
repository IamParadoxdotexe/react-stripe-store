import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';
import { getUrl } from '@/utils/functions/getUrl';
import { handleResponse } from '@/utils/functions/handleResponse';

export type CartItem = Product & { quantity: number };

export type Cart = {
  items: CartItem[];
  count: number;
  total: number;
};

export const CartService = new (class {
  public cart = new BehaviorSubject<Cart>({
    items: [],
    count: 0,
    total: 0
  });

  public updateCart(product: Product, quantity: number) {
    const cartItems = this.cart.value.items;

    const newCartItem = {
      ...product,
      quantity
    };

    const cartItemIndex = cartItems.findIndex(cartItem => cartItem.id === newCartItem.id);

    if (cartItemIndex > -1) {
      if (quantity > 0) {
        // update existing item
        cartItems.splice(cartItemIndex, 1, newCartItem);
      } else {
        // remove existing item
        cartItems.splice(cartItemIndex, 1);
      }
    } else if (quantity > 0) {
      // add new item
      cartItems.push(newCartItem);
    }

    // update cart count and total
    let cartCount = 0;
    let cartTotal = 0;

    for (const cartItem of cartItems) {
      cartCount += cartItem.quantity;
      cartTotal += cartItem.price.amount * cartItem.quantity;
    }

    this.cart.next({
      items: cartItems,
      count: cartCount,
      total: cartTotal
    });
  }

  public async checkout() {
    return fetch(getUrl('/api/stripe/checkout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.cart.value.items)
    })
      .then(handleResponse)
      .then(fetchResponse => {
        if (fetchResponse.isOk() && fetchResponse.body?.url) {
          window.location = fetchResponse.body?.url;
        }
        return fetchResponse;
      });
  }
})();
