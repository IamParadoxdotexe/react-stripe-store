import { useEffect, useState } from 'react';
import { Product } from '@/pages/api/products';
import { ShoppingCartOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import styles from './index.module.scss';

export default function Home() {
  const [products, setProducts] = useState<Product[]>();
  const [productPriceId, setProductPriceId] = useState<string>();

  function onCheckout() {
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: productPriceId
      })
    })
      .then(res => res.json())
      .then(({ url }) => {
        window.location = url;
      });
  }

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <>
      {products && (
        <div className={styles.products}>
          {products?.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => setProductPriceId(product.price.id)}
            />
          ))}
        </div>
      )}

      <div className={styles.checkout}>
        <Button
          variant="contained"
          startIcon={<ShoppingCartOutlined />}
          type="submit"
          disabled={!productPriceId}
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
    </>
  );
}
