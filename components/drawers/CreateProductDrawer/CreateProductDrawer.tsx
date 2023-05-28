import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { Drawer, DrawerService, DrawerType } from '@/services/DrawerService';
import { Button } from '@mui/material';
import { ImageInputButton } from '@/components/ImageInputButton/ImageInputButton';
import { ProductCardImage } from '@/components/ProductCard/ProductCardImage';
import { TextInput } from '@/components/TextInput';
import EditIcon from '@/icons/Edit.svg';
import PlusIcon from '@/icons/Plus.svg';
import { BaseDrawer } from '../BaseDrawer';
import styles from './CreateProductDrawer.module.scss';

const PRICE_REGEX = /^[\d]+\.[\d]{2}$/;

const DEFAULT_PRODUCT: Product = {
  id: '',
  name: '',
  description: '',
  price: {
    id: '',
    amount: 0
  },
  images: [],
  metadata: {}
};

export type CreateProductDrawerProps = {
  product?: Product;
};

type D = Drawer<DrawerType.CREATE_PRODUCT> | undefined;

const EDITABLED_KEYS = ['name', 'description', 'price.amount'];

export const CreateProductDrawer: React.FC = () => {
  const [product, setProduct] = useState<Product>(DEFAULT_PRODUCT);

  const drawer = useServiceState(DrawerService.drawer) as D;

  const image = product.images[0];

  const valid = useMemo(() => {
    const isNotNull = EDITABLED_KEYS.every(key => getNestedKey(product, key)) && !!image;

    const currentImage = drawer?.props.product?.images[0];
    const isChanged =
      EDITABLED_KEYS.some(
        key => getNestedKey(product, key) != getNestedKey(drawer?.props.product, key)
      ) || image != currentImage;

    return isNotNull && isChanged;
  }, [product]);

  const setProductImage = (image?: string) =>
    setProduct({ ...product, images: image ? [image] : [] });

  useEffect(() => {
    if (drawer?.props.product) {
      setProduct(_.cloneDeep(drawer.props.product));
    }
  }, [drawer]);

  return (
    <BaseDrawer
      title="Update Product"
      subtitle="Product updates will not take effect until all changes have been published."
    >
      <div className={styles.drawer__inputs}>
        <div className={styles.inputs__image}>
          <div className={styles.image__label}>Image</div>
          <div className={styles.image__uploads}>
            {product.images.map((image, i) => (
              <ProductCardImage key={i} src={image} size={180} />
            ))}

            <ImageInputButton
              icon={image ? <EditIcon /> : <PlusIcon />}
              label={image ? undefined : 'Add image'}
              onChange={setProductImage}
              className={image ? styles.uploads__edit : undefined}
            />
          </div>
        </div>

        <TextInput
          label="Name"
          placeholder="ex. Stanley Cup"
          value={product.name}
          onChange={name => setProduct({ ...product, name })}
          required
        />
        <TextInput
          label="Description"
          placeholder="ex. Seafoam Green"
          value={product.description}
          onChange={description => setProduct({ ...product, description })}
          required
        />
        <TextInput
          label="Price"
          adornments={{ start: '$' }}
          placeholder="19.99"
          value={product.price.amount ? product.price.amount.toFixed(2) : ''}
          onChange={value => {
            product.price.amount = parseFloat(value) || 0;
            setProduct({ ...product });
          }}
          validator={value => PRICE_REGEX.test(value)}
        />
      </div>

      <Button variant="contained" disabled={!valid}>
        Update
      </Button>
    </BaseDrawer>
  );
};
