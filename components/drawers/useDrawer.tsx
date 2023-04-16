import { ReactNode } from 'react';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { Drawer as MuiDrawer } from '@mui/material';
import { CartDrawer } from './CartDrawer/CartDrawer';

const DRAWER_CONTENTS: { [key in DrawerType]: ReactNode } = {
  CART: <CartDrawer />
};

export const useDrawer = () => {
  const isDrawerOpen = useServiceState(DrawerService.isOpen);
  const drawerType = useServiceState(DrawerService.drawerType);

  const Drawer = (
    <MuiDrawer anchor="right" open={isDrawerOpen} onClose={DrawerService.close}>
      {drawerType && DRAWER_CONTENTS[drawerType]}
    </MuiDrawer>
  );

  return { Drawer };
};
