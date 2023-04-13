import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import appConfig from '@/utils/constants/appConfig';
import { StripeEvent } from '@/utils/types/StripeEvent';
import { handleProductUpdated } from './product_updated';

export const pusher = new Pusher({
  appId: appConfig.pusher.appId,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET || '',
  cluster: appConfig.pusher.cluster
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).end();

  webhookHandlers[req.body.type]?.(req.body.data);
}

const webhookHandlers: { [type: string]: (data: any) => void } = {
  [StripeEvent.PRODUCT_UPDATED]: handleProductUpdated
};
