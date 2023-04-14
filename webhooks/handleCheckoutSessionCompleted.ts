import Stripe from 'stripe';
import appConfig from '@/utils/constants/appConfig';
import { getNestedKey } from '@/utils/functions/getNestedKey';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

type CheckoutSessionCompletedData = {
  object: Stripe.Checkout.Session;
};

export const handleCheckoutSessionCompleted = async ({
  object: session
}: CheckoutSessionCompletedData) => {
  // get line_items w/ product data
  session = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product']
  });

  for (const item of session.line_items?.data ?? []) {
    if (item.quantity && item.price) {
      const product = item.price.product as Stripe.Product;
      const stock = getNestedKey(product, appConfig.product.stockKey);
      if (stock) {
        // update stock count
        stripe.products.update(product.id, {
          metadata: { stock: Math.max(stock - item.quantity, 0) }
        });
      }
    }
  }
};
