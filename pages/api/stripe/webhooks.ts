import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Product, parseRawProduct } from '@/pages/api/stripe/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.end();

  webhookHandlers[req.body.type]?.(req.body.data);
}

const webhookHandlers: { [type: string]: (data: any) => void } = {
  'product.updated': async (data: {
    object: Stripe.Product;
    previous_attributes: { [key in keyof Stripe.Product]: string };
  }) => {
    const rawProduct = data.object;

    // get price amount if needed
    if (data.previous_attributes.default_price) {
      const price = await stripe.prices.retrieve(data.object.default_price as string);
      rawProduct.default_price = price;
    }

    const product = parseRawProduct(rawProduct);
    console.log(product);
  }
};
