import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const YOUR_DOMAIN = 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`
  });

  res.redirect(303, session.url);
}
