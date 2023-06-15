import Pusher, { Channel } from 'pusher-js';
import appConfig from '@/utils/constants/appConfig';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { ProductService } from '@/services/ProductService';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
  cluster: appConfig.pusher.cluster
});

const pusherHandlers: { [key in PusherEvent]: (data: any) => void } = {
  [PusherEvent.PRODUCT_UPDATED]: product => ProductService.onProductUpdated(product),
  [PusherEvent.PRODUCT_DELETED]: productId => ProductService.onProductDeleted(productId)
};

export const PusherService = new (class {
  public bind() {
    const mainChannel = pusher.subscribe('main');

    for (const event of Object.keys(PusherEvent)) {
      mainChannel.bind(event, (value: any) => {
        if (process.env.NEXT_PUBLIC_ENV === 'DEV') {
          console.log(event, value);
        }
        pusherHandlers[event as PusherEvent](value);
      });
    }
  }
})();
