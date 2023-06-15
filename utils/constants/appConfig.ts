import Stripe from 'stripe';
import { Content, ContentType } from '@/utils/types/Content';

type AppConfig = {
  url: string;
  checkout: {
    successUrl: string;
    errorUrl: string;
    shipping?: {
      countries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
    };
  };
  product: {
    titleKey: string;
    subtitleKey: string;
    stockKey: string;
  };
  pusher: {
    appId: string;
    cluster: string;
  };
  adminUserIds: string[];
  content: {
    home: Content[];
  };
};

const appConfig: AppConfig = {
  url: 'https://react-stripe-store.vercel.app',
  checkout: {
    successUrl: '/',
    errorUrl: '/',
    shipping: {
      countries: ['US']
    }
  },
  product: {
    titleKey: 'name',
    subtitleKey: 'description',
    stockKey: 'metadata.stock'
  },
  pusher: {
    appId: '1584134',
    cluster: 'us2'
  },
  adminUserIds: ['user_2RDdlSEI7LUFF8fzQG3TycytUid'],
  content: {
    home: [
      {
        key: 'cups',
        type: ContentType.CAROUSEL,
        title: 'Featured Cups',
        hasProduct: product => product.name.includes('Cup')
      }
    ]
  }
};

export default appConfig;
