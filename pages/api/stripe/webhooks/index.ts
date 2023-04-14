import { handleCheckoutSessionCompleted } from '@/webooks/handleCheckoutSessionCompleted';
import { handleProductUpdated } from '@/webooks/handleProductUpdated';
import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import appConfig from '@/utils/constants/appConfig';

export const pusher = new Pusher({
  appId: appConfig.pusher.appId,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET || '',
  cluster: appConfig.pusher.cluster
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.end();

  webhookHandlers[req.body.type]?.(req.body.data);
}

const webhookHandlers: { [type: string]: (data: any) => void } = {
  'product.updated': handleProductUpdated,
  'checkout.session.completed': handleCheckoutSessionCompleted
};
