import { BehaviorSubject } from 'rxjs';
import { CreateProductDrawerProps } from '@/components/drawers/CreateProductDrawer';

export enum DrawerType {
  CART = 'CART',
  CREATE_PRODUCT = 'CREATE_PRODUCT'
}

interface DrawerTypeProps {
  CART: {};
  CREATE_PRODUCT: CreateProductDrawerProps;
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
