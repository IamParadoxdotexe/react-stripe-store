import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Product } from '@/pages/api/stripe/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

interface CreateProductRequest extends NextApiRequest {
  body: Product;
}

export default async function handler(req: CreateProductRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ detail: 'No product data provided.' });
  }

  const unitAmount = req.body.price.amount * 100;

  if (req.body.id) {
    const prices = await stripe.prices
      .search({ query: `product:"${req.body.id}"` })
      .then(res => res.data);

    // search for existing price with correct amount
    let matchingPrice: Stripe.Price | undefined = undefined;
    for (const price of prices) {
      if (price.unit_amount === unitAmount) {
        matchingPrice = price;
        break;
      }
    }

    // create new price if needed
    if (!matchingPrice) {
      matchingPrice = await stripe.prices.create({
        currency: 'USD',
        unit_amount: unitAmount,
        product: req.body.id,
        active: true
      });
    }

    // update existing product
    await stripe.products.update(req.body.id, {
      name: req.body.name,
      description: req.body.description,
      default_price: matchingPrice.id
    });
  } else {
    // create new product
    await stripe.products.create({
      id: req.body.id || undefined,
      name: req.body.name,
      description: req.body.description,
      default_price_data: {
        currency: 'USD',
        unit_amount: unitAmount
      }
    });
  }

  res.status(200).json({});
}
