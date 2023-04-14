import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { handleCheckoutSessionCompleted } from '@/webhooks/handleCheckoutSessionCompleted';
import { handleProductDeleted } from '@/webhooks/handleProductDeleted';
import { handleProductUpdated } from '@/webhooks/handleProductUpdated';
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
  'product.updated': data => handleProductUpdated({ ...data, created: false }),
  'product.created': data => handleProductUpdated({ ...data, created: true }),
  'product.deleted': handleProductDeleted,
  'checkout.session.completed': handleCheckoutSessionCompleted
};
