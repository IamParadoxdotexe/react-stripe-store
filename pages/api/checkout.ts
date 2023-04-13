import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAppConfig } from '@/utils/functions/getConfig';

const appConfig = getAppConfig();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: appConfig.checkout.successUrl,
    cancel_url: appConfig.checkout.errorUrl
  };

  if (appConfig.checkout.shipping) {
    sessionParams.shipping_address_collection = {
      allowed_countries: appConfig.checkout.shipping.countries
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  res.status(201).json({ url: session.url });
}
