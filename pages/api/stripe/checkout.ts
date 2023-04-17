import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import appConfig from '@/utils/constants/appConfig';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { CartItem } from '@/services/CartService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

interface CheckoutRequest extends NextApiRequest {
  body: CartItem[];
}

export default async function handler(req: CheckoutRequest, res: NextApiResponse) {
  if (req.body.length === 0) {
    return res.status(400).json({ detail: 'At least one cart item required.' });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = req.body.map(cartItem => ({
    price: cartItem.price.id,
    quantity: cartItem.quantity,
    adjustable_quantity: {
      enabled: true,
      maximum: getNestedKey(cartItem, appConfig.product.stockKey) || undefined
    }
  }));

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    line_items: lineItems,
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
