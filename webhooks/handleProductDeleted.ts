import Stripe from 'stripe';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { pusher } from '../pages/api/stripe/webhooks';

type ProductDeletedData = {
  object: Stripe.Product;
};

export const handleProductDeleted = async ({ object: rawProduct }: ProductDeletedData) => {
  pusher.trigger('main', PusherEvent.PRODUCT_DELETED, rawProduct.id);
};
