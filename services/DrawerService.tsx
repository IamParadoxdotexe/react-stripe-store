import { BehaviorSubject } from 'rxjs';
import { UpdateProductDrawerProps } from '@/components/drawers/UpdateProductDrawer';

export enum DrawerType {
  CART = 'CART',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT'
}

interface DrawerTypeProps {
  CART: {};
  UPDATE_PRODUCT: UpdateProductDrawerProps;
}

export type Drawer<T extends DrawerType> = {
  type: T;
  props: DrawerTypeProps[T];
};

export const DrawerService = new (class {
  public isOpen = new BehaviorSubject(false);
  public drawer = new BehaviorSubject<Drawer<DrawerType> | undefined>(undefined);

  public open = <T extends DrawerType>(type: T, props: DrawerTypeProps[T]) => {
    this.drawer.next({ type, props });
    this.isOpen.next(true);
  };

  public close = () => {
    this.isOpen.next(false);
  };
})();
