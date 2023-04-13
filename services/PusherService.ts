import Pusher from 'pusher-js';
import appConfig from '@/utils/constants/appConfig';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { ProductService } from '@/services/ProductService';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
  cluster: appConfig.pusher.cluster
});

const mainChannel = pusher.subscribe('main');

const pusherHandlers: { [type: string]: (data: any) => void } = {
  [PusherEvent.PRODUCT_UPDATED]: products => ProductService.onProductUpdated(products)
};

export const PusherService = new (class {
  public bind() {
    for (const key of Object.keys(pusherHandlers)) {
      mainChannel.bind(key, pusherHandlers[key]);
    }
  }

  public unbind() {
    mainChannel.unsubscribe();
  }
})();
