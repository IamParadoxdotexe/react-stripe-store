import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '@/pages/api/stripe/products';
import { getNestedKey } from '@/utils/functions/getNestedKey';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { Drawer, DrawerService, DrawerType } from '@/services/DrawerService';
import { ProductService } from '@/services/ProductService';
import { LoadingButton } from '@mui/lab';
import { ImageInputButton } from '@/components/ImageInputButton/ImageInputButton';
import { ProductCardImage } from '@/components/ProductCard/ProductCardImage';
import { TextInput } from '@/components/TextInput';
import EditIcon from '@/icons/Edit.svg';
import PlusIcon from '@/icons/Plus.svg';
import { BaseDrawer } from '../BaseDrawer';
import styles from './UpdateProductDrawer.module.scss';

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
  metadata: {},
  active: true
};

const NEW_PRODUCT_TITLE = 'Add Product';
const EXISTING_PRODUCT_TITLE = 'Update Product';

const NEW_PRODUCT_SUBTITLE = 'Post a new product for customers to purchase.';
const EXISTING_PRODUCT_SUBTITLE = 'Edit the properties of an existing product.';

export type UpdateProductDrawerProps = {
  product?: Product;
};

type D = Drawer<DrawerType.UPDATE_PRODUCT> | undefined;

const EDITABLED_KEYS = ['name', 'description', 'price.amount'];

export const UpdateProductDrawer: React.FC = () => {
  const [product, setProduct] = useState<Product>(_.cloneDeep(DEFAULT_PRODUCT));

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isLoading = isUpdating || isDeleting;

  const image = product.images[0];

  const drawer = useServiceState(DrawerService.drawer) as D;
  const isNew = !drawer?.props.product;

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

  const onUpdate = async () => {
    setIsUpdating(true);
    await ProductService.update(product);
    DrawerService.close();
  };

  const onDelete = async () => {
    setIsDeleting(true);
    await ProductService.delete(product);
    DrawerService.close();
  };

  useEffect(() => {
    if (drawer?.props.product) {
      setProduct(_.cloneDeep(drawer.props.product));
    }
  }, [drawer]);

  return (
    <BaseDrawer
      title={isNew ? NEW_PRODUCT_TITLE : EXISTING_PRODUCT_TITLE}
      subtitle={isNew ? NEW_PRODUCT_SUBTITLE : EXISTING_PRODUCT_SUBTITLE}
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
              disabled={isLoading}
            />
          </div>
        </div>

        <TextInput
          label="Name"
          placeholder="ex. Stanley Cup"
          value={product.name}
          onChange={name => setProduct({ ...product, name })}
          required
          disabled={isLoading}
        />
        <TextInput
          label="Description"
          placeholder="ex. Seafoam Green"
          value={product.description}
          onChange={description => setProduct({ ...product, description })}
          required
          disabled={isLoading}
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
          validator={value => PRICE_REGEX.test(value) && parseFloat(value) > 0}
          disabled={isLoading}
        />
      </div>

      <div className={styles.drawer__actions}>
        <LoadingButton
          variant="contained"
          disabled={!valid || isLoading}
          onClick={onUpdate}
          loading={isUpdating}
        >
          {isNew ? 'Add' : 'Update'}
        </LoadingButton>

        {!isNew && (
          <LoadingButton
            variant="outlined"
            disabled={isLoading}
            color="error"
            onClick={onDelete}
            loading={isDeleting}
          >
            Delete
          </LoadingButton>
        )}
      </div>
    </BaseDrawer>
  );
};
