import Pusher from 'pusher-js';
import appConfig from '@/utils/constants/appConfig';
import { PusherEvent } from '@/utils/types/PusherEvent';
import { ProductService } from '@/services/ProductService';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
  cluster: appConfig.pusher.cluster
});

const mainChannel = pusher.subscribe('main');

const pusherHandlers: { [key in PusherEvent]: (data: any) => void } = {
  [PusherEvent.PRODUCT_UPDATED]: product => ProductService.onProductUpdated(product),
  [PusherEvent.PRODUCT_CREATED]: product => ProductService.onProductCreated(product),
  [PusherEvent.PRODUCT_DELETED]: productId => ProductService.onProductDeleted(productId)
};

export const PusherService = new (class {
  public bind() {
    for (const event of Object.keys(PusherEvent)) {
      mainChannel.bind(event, pusherHandlers[event as PusherEvent]);
    }
  }

  public unbind() {
    mainChannel.unsubscribe();
  }
})();
