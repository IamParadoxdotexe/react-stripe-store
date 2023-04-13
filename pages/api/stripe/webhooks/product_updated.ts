import Stripe from 'stripe';
import { parseRawProduct } from '@/pages/api/stripe/products';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { pusher } from '.';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

type ProductUpdatedData = {
  object: Stripe.Product;
  previous_attributes: { [key in keyof Stripe.Product]: string };
};

export const handleProductUpdated = async (data: ProductUpdatedData) => {
  const rawProduct = data.object;

  // get price amount if needed
  if (data.previous_attributes.default_price) {
    const price = await stripe.prices.retrieve(data.object.default_price as string);
    rawProduct.default_price = price;
  }

  const product = parseRawProduct(rawProduct);

  pusher.trigger('main', PusherEvent.PRODUCT_UPDATED, product);
};
