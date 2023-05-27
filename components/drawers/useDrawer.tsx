import { ReactNode } from 'react';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { Drawer as MuiDrawer } from '@mui/material';
import { CartDrawer } from './CartDrawer';
import { CreateProductDrawer } from './CreateProductDrawer';

const DRAWER_CONTENTS: { [key in DrawerType]: ReactNode } = {
  CART: <CartDrawer />,
  CREATE_PRODUCT: <CreateProductDrawer />
};

export const useDrawer = () => {
  const isOpen = useServiceState(DrawerService.isOpen);
  const drawer = useServiceState(DrawerService.drawer);

  const Drawer = (
    <MuiDrawer anchor="right" open={isOpen} onClose={DrawerService.close}>
      {drawer && DRAWER_CONTENTS[drawer.type]}
    </MuiDrawer>
  );

  return { Drawer };
};
