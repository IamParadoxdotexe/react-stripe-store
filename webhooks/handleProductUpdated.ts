import Stripe from 'stripe';
import { parseRawProduct } from '@/pages/api/stripe/products';
import { pusher } from '@/pages/api/stripe/webhooks';
import { PusherEvent } from '@/utils/types/PusherEvent';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

type ProductUpdatedData = {
  object: Stripe.Product;
  previous_attributes: { [key in keyof Stripe.Product]: string };
};

export const handleProductUpdated = async ({ object: rawProduct }: ProductUpdatedData) => {
  // get expanded price w/ amount
  if (rawProduct.default_price) {
    const price = await stripe.prices.retrieve(rawProduct.default_price as string);
    rawProduct.default_price = price;
  }

  const product = parseRawProduct(rawProduct);

  pusher.trigger('main', PusherEvent.PRODUCT_UPDATED, product);
};
