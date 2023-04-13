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
  };
};

/**
 * Get app configuration.
 */
export const getAppConfig = () => appConfig as AppConfig;
