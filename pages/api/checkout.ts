import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

const YOUR_DOMAIN = 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1MvsEdJBo0rY11ssmC4ehhiG',
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}`,
    cancel_url: `${YOUR_DOMAIN}`
  });

  res.redirect(303, session.url || '');
}
