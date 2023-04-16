import { BehaviorSubject } from 'rxjs';

export enum DrawerType {
  CART = 'CART'
}

export const DrawerService = new (class {
  public isOpen = new BehaviorSubject(false);
  public drawerType = new BehaviorSubject<DrawerType | undefined>(undefined);

  public open = (drawerType: DrawerType) => {
    this.drawerType.next(drawerType);
    this.isOpen.next(true);
  };

  public close = () => {
    this.isOpen.next(false);
  };
})();
