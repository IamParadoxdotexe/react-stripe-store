import type { NextApiRequest, NextApiResponse } from 'next';
import { handleProductUpdated } from './product_updated';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.end();

  webhookHandlers[req.body.type]?.(req.body.data);
}

const webhookHandlers: { [type: string]: (data: any) => void } = {
  'product.updated': handleProductUpdated
};
