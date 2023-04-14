import appConfig from '@/appConfig.json';
import Stripe from 'stripe';

type AppConfig = {
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
};

export default appConfig as AppConfig;
