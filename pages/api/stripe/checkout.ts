import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import appConfig from '@/utils/constants/appConfig';
import { Cart } from '@/services/CartService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

interface CheckoutRequest extends NextApiRequest {
  body: Cart;
}

export default async function handler(req: CheckoutRequest, res: NextApiResponse) {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    line_items: Object.entries(req.body).map(([price, quantity]) => ({
      price,
      quantity
    })),
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
