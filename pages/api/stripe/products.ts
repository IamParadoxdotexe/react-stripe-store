import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

export type Product = {
  id: string;
  price: {
    id: string;
    amount: number;
  };
  name: string;
  description?: string;
  images: string[];
  metadata: {
    [key: string]: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawProducts = await stripe.products
    .list({ expand: ['data.default_price'] })
    .then(res => res.data);

  const products: Product[] = rawProducts.map(parseRawProduct);

  res.status(200).json(products);
}

export const parseRawProduct = (rawProduct: Stripe.Product) => {
  const rawPrice = rawProduct.default_price as Stripe.Price | undefined;

  return {
    id: rawProduct.id,
    price: {
      id: rawPrice?.id ?? '',
      amount: rawPrice?.unit_amount ? rawPrice.unit_amount / 100 : 0
    },
    name: rawProduct.name,
    description: rawProduct.description,
    images: rawProduct.images,
    metadata: rawProduct.metadata
  } as Product;
};
