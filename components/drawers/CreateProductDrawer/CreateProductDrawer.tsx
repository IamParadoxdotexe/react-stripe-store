import React, { useEffect, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { Drawer, DrawerService, DrawerType } from '@/services/DrawerService';
import { TextInput } from '@/components/TextInput';
import { BaseDrawer } from '../BaseDrawer';
import styles from './CreateProductDrawer.module.scss';

export type CreateProductDrawerProps = {
  product: Product;
};

export const CreateProductDrawer: React.FC = () => {
  const [product, setProduct] = useState<Product>();

  const drawer = useServiceState(DrawerService.drawer);

  useEffect(() => {
    if (drawer) {
      setProduct((drawer as Drawer<DrawerType.CREATE_PRODUCT>).props.product);
    }
  }, [drawer]);

  return (
    <BaseDrawer
      title="Update Product"
      subtitle="Product updates will not take effect until all changes have been published."
    >
      {product && (
        <div className={styles.drawer__inputs}>
          <TextInput
            label="Name"
            placeholder="ex. Stanley Cup"
            value={product.name}
            onChange={name => setProduct({ ...product, name })}
          />
          <TextInput
            label="Description"
            placeholder="ex. Seafoam Green"
            value={product.description}
            onChange={description => setProduct({ ...product, description })}
          />
          <TextInput
            label="Price"
            startAdornment={<>$</>}
            placeholder="19.99"
            value={product.price.amount.toString()}
            onChange={value => {
              const amount = parseFloat(value);
              product.price.amount = amount || 0;
              setProduct({ ...product });
            }}
          />
        </div>
      )}
    </BaseDrawer>
  );
};
