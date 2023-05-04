import Stripe from 'stripe';
import { pusher } from '@/pages/api/stripe/webhooks';
import { PusherEvent } from '@/utils/types/PusherEvent';

type ProductDeletedData = {
  object: Stripe.Product;
};

export const handleProductDeleted = async ({ object: rawProduct }: ProductDeletedData) => {
  pusher.trigger('main', PusherEvent.PRODUCT_DELETED, rawProduct.id);
};
