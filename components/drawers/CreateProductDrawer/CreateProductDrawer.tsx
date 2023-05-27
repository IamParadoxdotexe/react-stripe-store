import React from 'react';
import { Product } from '@/pages/api/stripe/products';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { Drawer, DrawerService, DrawerType } from '@/services/DrawerService';
import { BaseDrawer } from '../BaseDrawer';

export type CreateProductDrawerProps = {
  product: Product;
};

export const CreateProductDrawer: React.FC = () => {
  const drawer = useServiceState(DrawerService.drawer) as
    | Drawer<DrawerType.CREATE_PRODUCT>
    | undefined;
  const product = drawer?.props.product;

  return (
    <BaseDrawer
      title="Update Product"
      subtitle="Product updates will not take effect until all changes have been published."
    >
      {product?.name}
    </BaseDrawer>
  );
};
