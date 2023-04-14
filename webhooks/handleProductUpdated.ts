import Stripe from 'stripe';
import { parseRawProduct } from '@/pages/api/stripe/products';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { pusher } from '../pages/api/stripe/webhooks';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

type ProductUpdatedData = {
  object: Stripe.Product;
  previous_attributes: { [key in keyof Stripe.Product]: string };
  created: boolean;
};

export const handleProductUpdated = async ({ object: rawProduct, created }: ProductUpdatedData) => {
  // get expanded price w/ amount
  if (rawProduct.default_price) {
    const price = await stripe.prices.retrieve(rawProduct.default_price as string);
    rawProduct.default_price = price;
  }

  const product = parseRawProduct(rawProduct);

  pusher.trigger(
    'main',
    created ? PusherEvent.PRODUCT_CREATED : PusherEvent.PRODUCT_UPDATED,
    product
  );
};
