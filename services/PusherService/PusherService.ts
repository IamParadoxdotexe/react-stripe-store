import Pusher from 'pusher-js';
import appConfig from '@/utils/constants/appConfig';
import { StripeEvent } from '@/utils/types/StripeEvent';
import { onProductUpdated } from './product_updated';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
  cluster: appConfig.pusher.cluster
});

const stripeChannel = pusher.subscribe('stripe');

const stripePusherHandlers: { [type: string]: (data: any) => void } = {
  [StripeEvent.PRODUCT_UPDATED]: onProductUpdated
};

export const PusherService = new (class {
  public bind() {
    for (const key of Object.keys(stripePusherHandlers)) {
      stripeChannel.bind(key, stripePusherHandlers[key]);
    }
  }

  public unbind() {
    stripeChannel.unsubscribe();
  }
})();
