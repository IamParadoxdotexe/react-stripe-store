import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Product } from '@/pages/api/stripe/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

interface CreateProductRequest extends NextApiRequest {
  body: Product;
}

export default async function handler(req: CreateProductRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ detail: 'No product data provided.' });
  }

  let images = req.body.images;

  // upload new image file if needed
  if (images[0] && images[0].startsWith('data:image/png;base64')) {
    // remove data:image/png;base64
    const base64 = Buffer.from(images[0].split(',')[1], 'base64');

    const name = `${req.body.name} ${req.body.description}`.toLowerCase().replace(/ /g, '-');

    const file = await stripe.files.create({
      file: {
        data: base64,
        name: `${name}.png`,
        type: 'image/png'
      },
      purpose: 'product_image',
      // creates public link
      file_link_data: {
        create: true
      }
    });

    images = [file.links?.data[0].url!];
  }

  const baseProduct = {
    name: req.body.name,
    description: req.body.description,
    images,
    metadata: req.body.metadata
  };

  const unitAmount = req.body.price.amount * 100;

  if (req.body.id) {
    const prices = await stripe.prices
      .search({ query: `product:"${req.body.id}"` })
      .then(res => res.data);

    // search for existing price with correct amount
    let matchingPrice: Stripe.Price | undefined = undefined;
    for (const price of prices) {
      if (price.unit_amount === unitAmount) {
        matchingPrice = price;
        break;
      }
    }

    // create new price if needed
    if (!matchingPrice) {
      matchingPrice = await stripe.prices.create({
        currency: 'USD',
        unit_amount: unitAmount,
        product: req.body.id,
        active: true
      });
    }

    // update existing product
    await stripe.products.update(req.body.id, {
      ...baseProduct,
      default_price: matchingPrice.id
    });
  } else {
    // create new product
    await stripe.products.create({
      ...baseProduct,
      default_price_data: {
        currency: 'USD',
        unit_amount: unitAmount
      }
    });
  }

  res.status(200).json({});
}
