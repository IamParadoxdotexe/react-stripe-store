# react-stripe-store

This is a boilerplate e-commerce website that can be used to sell products via the Stripe API.

This website employs the following technologies:

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/) - provides a framework for client-side rendering and serverless API endpoints
- [Pusher](https://pusher.com/) - provides a persistent server for live WebSocket connections
- [Stripe](https://stripe.com/) - provides an externally-hosted transaction portal and inventory database
- [Clerk](https://clerk.com/) - provides an authentication portal and user database for admin access

## Getting Started

### Environmental Variables

First, create a `.env.local` file at the root with the following environmental variables:

```
STRIPE_SECRET_KEY=<your key here>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your key here>
CLERK_SECRET_KEY=<your key here>
NEXT_PUBLIC_PUSHER_APP_KEY=<your key here>
NEXT_PUBLIC_PUSHER_APP_SECRET=<your secret here>
NEXT_PUBLIC_ENV=DEV
```

The `STRIPE_SECRET_KEY` will be used to push/pull your product data and forward users to the Stripe-hosted transaction portal.

The `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` will be used to authenticate admin access via the Clerk-hosted authentication portal.

The `NEXT_PUBLIC_PUSHER_APP_KEY` and `NEXT_PUBLIC_PUSHER_APP_SECRET` will be used to facilitate live data updates between Stripe and your website.

### App Configuration

To configure your website, you can modify the `appConfig.json` file. The options available are detailed below.

- `url` - hosted domain URL
- `checkout`
  - `successUrl` - redirect URL after successful Stripe transaction
  - `errorUrl` - redirect URL after erroneous Stripe transaction
  - `shipping`
    - `countries` - countries where shipping is available [(docs)](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-shipping_address_collection)
- `product` - keys used to pull from Stripe product data [(docs)](https://stripe.com/docs/api/products/object)
  - `titleKey` - product title key
  - `subtitleKey` - product subtitle key
  - `stockKey` - product stock count key
- `pusher` - Pusher configuration
  - `appId` - Pusher app_id
  - `cluster` - Pusher cluster

### Development Server

To run the development server and open a local webhook with Stripe, run the following command.

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Using [Vercel](https://vercel.com/), you can deploy your website immediately with the steps below.

### Stripe

1. Add a new webhook for your hosted domain URL with the slug `/api/stripe/webhooks`
2. Listen to the following events:
   - `checkout.session.completed`
   - `product.created`
   - `product.deleted`
   - `product.updated`

### Vercel

1. Add a new project pointing at your forked repository
2. Add your environmental variables for `Stripe` and `Pusher`
3. Update the environmental variable `NEXT_PUBLIC_ENV=PROD`
4. Deploy and view your website!
