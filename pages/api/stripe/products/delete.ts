import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

/**
 * Delete existing product.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.id as string;

  if (!productId) {
    return res.status(400).json({ detail: 'Query param "id" required.' });
  }

  // deactivate product
  await stripe.products.update(productId, { active: false });

  res.status(200).json({});
}
